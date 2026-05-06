"use client";
import React, { useEffect, useRef } from "react";
import { physicsObjects } from "@/data/physicsObjects";

interface PhysicsSettings {
  gravity: { x: number; y: number };
  scale: number;
  startY: number;
  wallThickness: number;
  physics: {
    restitution: number;
    friction: number;
    frictionAir: number;
    density: number;
  };
}

interface PhysicsObject {
  body: Matter.Body;
  element: HTMLImageElement;
  baseWidth: number;
  aspectRatio: number;
  width: number;
  height: number;
  isCircle: boolean;
  isVisible: boolean;
}

export function Physics() {
  const hasInitialized = useRef<boolean>(false);
  const engineRef = useRef<Matter.Engine | null>(null);
  const physicsObjectsRef = useRef<PhysicsObject[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (hasInitialized.current) return;
    if (physicsObjects.length === 0) return;

    const container = document.getElementById("physics-container");
    if (!container) return;

    // Warm caches before the section enters the viewport — matter-js gets
    // loaded into the module cache and each SVG into the browser image
    // cache, so initPhysics() runs without a visible network wait.
    void import("matter-js");
    physicsObjects.forEach((obj) => {
      const img = new window.Image();
      img.src = obj.imageUrl;
    });

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasInitialized.current) {
          observer.disconnect();
          initPhysics();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(container);

    let cleanupFn: (() => void) | undefined;

    function initPhysics() {
      if (!container) return;
      import("matter-js").then((Matter) => {
        if (hasInitialized.current) return;
        hasInitialized.current = true;

        const getResponsiveScale = () => {
          const width = window.innerWidth;
          if (width < 640) return 0.5;
          if (width < 768) return 0.55;
          if (width < 1024) return 0.6;
          return 0.7;
        };

        const SETTINGS: PhysicsSettings = {
          gravity: { x: 0, y: 0.5 },
          scale: getResponsiveScale(),
          startY: -20,
          wallThickness: 100,
          physics: {
            restitution: 0.6,
            friction: 0.001,
            frictionAir: 0.001,
            density: 0.001,
          },
        };

        const { Engine, Bodies, Composite, Body, Mouse, MouseConstraint } = Matter;
        const engine = Engine.create();
        engineRef.current = engine;
        const world = engine.world;
        engine.gravity.x = SETTINGS.gravity.x;
        engine.gravity.y = SETTINGS.gravity.y;
        engine.timing.timeScale = 1.0;
        engine.timing.timestamp = 0;

        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;
        // Distance from container top to page top
        const containerTop = container.getBoundingClientRect().top + window.scrollY;

        const existingImages = container.querySelectorAll(".physics-image");
        existingImages.forEach((el) => el.remove());

        // Top wall: at page top (dynamically calculated based on page height)
        const topWall = Bodies.rectangle(
          containerWidth / 2,
          -containerTop - SETTINGS.wallThickness / 2,
          containerWidth,
          SETTINGS.wallThickness,
          { isStatic: true, render: { visible: false } }
        );

        // Bottom wall (wider to prevent edge escapes during resize)
        const bottomWall = Bodies.rectangle(
          containerWidth / 2,
          containerHeight + SETTINGS.wallThickness / 2,
          containerWidth + 2000,
          SETTINGS.wallThickness,
          { isStatic: true, render: { visible: false } }
        );

        // Left wall (extends from page top to container bottom)
        const totalHeight = containerTop + containerHeight;
        const wallCenterY = (containerHeight - containerTop) / 2;
        const leftWall = Bodies.rectangle(
          -SETTINGS.wallThickness / 2,
          wallCenterY,
          SETTINGS.wallThickness,
          totalHeight,
          { isStatic: true, render: { visible: false } }
        );

        // Right wall (extends from page top to container bottom)
        const rightWall = Bodies.rectangle(
          containerWidth + SETTINGS.wallThickness / 2,
          wallCenterY,
          SETTINGS.wallThickness,
          totalHeight,
          { isStatic: true, render: { visible: false } }
        );

        Composite.add(world, [topWall, bottomWall, leftWall, rightWall]);

        const createPhysicsObject = (
          objData: (typeof physicsObjects)[0]
        ): Promise<void> =>
          new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
              const baseWidth = objData.width || img.naturalWidth;
              const aspectRatio = img.naturalHeight / img.naturalWidth;
              const w = baseWidth * SETTINGS.scale;
              const h = w * aspectRatio;

              // Spawn in the right 60% area (where content is, not behind sticky Profile)
              // On mobile (inlg breakpoint), spawn across full width
              const isMobile = window.innerWidth <= 1024;
              const spawnAreaStart = isMobile ? 0 : containerWidth * 0.4;
              const spawnAreaWidth = isMobile ? containerWidth : containerWidth * 0.6;
              const x = spawnAreaStart + Math.random() * (spawnAreaWidth - w);
              const y = SETTINGS.startY - Math.random() * 20;

              img.className = "physics-image";
              img.style.width = `${w}px`;
              img.style.height = `${h}px`;
              img.style.position = "absolute";
              img.style.cursor = "grab";
              img.style.userSelect = "none";
              img.style.webkitUserSelect = "none";
              img.style.willChange = "transform";
              img.style.opacity = "0";
              img.style.pointerEvents = "auto";
              img.style.zIndex = "100";

              container.appendChild(img);

              const isCircle = objData.bodyType === "circle";
              let body: Matter.Body;

              const bodyOptions = {
                restitution: SETTINGS.physics.restitution,
                friction: SETTINGS.physics.friction,
                frictionAir: SETTINGS.physics.frictionAir,
                density: SETTINGS.physics.density,
                render: { visible: false },
                slop: 0.05,
              };

              if (isCircle) {
                const radius = Math.min(w, h) / 2;
                body = Bodies.circle(x + w / 2, y + h / 2, radius, bodyOptions);
                img.style.borderRadius = "50%";
              } else {
                body = Bodies.rectangle(x + w / 2, y + h / 2, w, h, bodyOptions);
              }

              Composite.add(world, body);
              physicsObjectsRef.current.push({
                body,
                element: img,
                baseWidth,
                aspectRatio,
                width: w,
                height: h,
                isCircle,
                isVisible: false,
              });

              resolve();
            };
            img.onerror = () => {
              console.error("Image load failed:", objData.imageUrl);
              resolve();
            };
            img.src = objData.imageUrl;
            img.crossOrigin = "anonymous";
          });

        const runPhysics = (currentTime: number): void => {
          if (!engineRef.current) return;

          lastTimeRef.current = currentTime;
          const fixedDeltaTime = 1000 / 60;

          animationFrameRef.current = requestAnimationFrame(runPhysics);

          physicsObjectsRef.current.forEach((obj) => {
            const { body, element, width, height, isCircle } = obj;
            if (body && element) {
              if (!obj.isVisible) {
                element.style.opacity = "1";
                obj.isVisible = true;
              }

              if (isCircle) {
                const radius = width / 2;
                element.style.transform = `translate(${body.position.x - radius}px, ${body.position.y - radius}px) rotate(${body.angle}rad)`;
              } else {
                element.style.transform = `translate(${body.position.x - width / 2}px, ${body.position.y - height / 2}px) rotate(${body.angle}rad)`;
              }
            }
          });

          Engine.update(engineRef.current, fixedDeltaTime);
        };

        const setupMouse = (): void => {
          const mouse = Mouse.create(container);

          const mouseConstraint = MouseConstraint.create(engineRef.current!, {
            mouse: mouse,
            constraint: {
              stiffness: 0.8,
              damping: 0.05,
              render: { visible: false },
            },
          });

          if (mouseConstraint.constraint) {
            const c = mouseConstraint.constraint as { angleA?: number; angleB?: number; length?: number };
            c.angleA = 0;
            c.angleB = 0;
            c.length = 0;
          }

          // Allow page scroll — remove Matter.js wheel capture
          mouse.element.removeEventListener(
            "wheel",
            (mouse as unknown as { mousewheel: EventListener }).mousewheel
          );

          mouseConstraint.mouse.element.addEventListener(
            "mousedown",
            (event: MouseEvent) => {
              physicsObjectsRef.current.forEach((obj) => {
                obj.element.style.cursor = "grabbing";
              });
              event.preventDefault();
            }
          );

          mouseConstraint.mouse.element.addEventListener("mouseup", () => {
            physicsObjectsRef.current.forEach((obj) => {
              obj.element.style.cursor = "grab";
            });
          });

          mouseConstraint.mouse.element.addEventListener("mouseleave", () => {
            physicsObjectsRef.current.forEach((obj) => {
              obj.element.style.cursor = "grab";
            });
          });

          mouseConstraint.mouse.element.addEventListener(
            "touchstart",
            (event: TouchEvent) => {
              physicsObjectsRef.current.forEach((obj) => {
                obj.element.style.cursor = "grabbing";
              });
              event.preventDefault();
            },
            { passive: false }
          );

          mouseConstraint.mouse.element.addEventListener("touchend", () => {
            physicsObjectsRef.current.forEach((obj) => {
              obj.element.style.cursor = "grab";
            });
          });

          Composite.add(world, mouseConstraint);
        };

        (async (): Promise<void> => {
          await Promise.all(physicsObjects.map(createPhysicsObject));
          setupMouse();

          setTimeout(() => {
            lastTimeRef.current = performance.now();
            runPhysics(lastTimeRef.current);
          }, 50);
        })();

        let resizeTimeout: NodeJS.Timeout | null = null;

        const handleResize = (): void => {
          if (resizeTimeout) clearTimeout(resizeTimeout);

          resizeTimeout = setTimeout(() => {
            const newWidth = container.offsetWidth;
            const newHeight = container.offsetHeight;
            const newScale = getResponsiveScale();

            const newContainerTop = container.getBoundingClientRect().top + window.scrollY;
            Body.setPosition(topWall, { x: newWidth / 2, y: -newContainerTop - SETTINGS.wallThickness / 2 });
            Body.setVertices(topWall, Bodies.rectangle(newWidth / 2, -newContainerTop - SETTINGS.wallThickness / 2, newWidth, SETTINGS.wallThickness, { isStatic: true }).vertices);

            Body.setPosition(bottomWall, { x: newWidth / 2, y: newHeight + SETTINGS.wallThickness / 2 });
            Body.setVertices(bottomWall, Bodies.rectangle(newWidth / 2, newHeight + SETTINGS.wallThickness / 2, newWidth + 2000, SETTINGS.wallThickness, { isStatic: true }).vertices);

            const newTotalHeight = newContainerTop + newHeight;
            const newWallCenterY = (newHeight - newContainerTop) / 2;
            Body.setPosition(leftWall, { x: -SETTINGS.wallThickness / 2, y: newWallCenterY });
            Body.setVertices(leftWall, Bodies.rectangle(-SETTINGS.wallThickness / 2, newWallCenterY, SETTINGS.wallThickness, newTotalHeight, { isStatic: true }).vertices);

            Body.setPosition(rightWall, { x: newWidth + SETTINGS.wallThickness / 2, y: newWallCenterY });
            Body.setVertices(rightWall, Bodies.rectangle(newWidth + SETTINGS.wallThickness / 2, newWallCenterY, SETTINGS.wallThickness, newTotalHeight, { isStatic: true }).vertices);

            if (newScale !== SETTINGS.scale) {
              SETTINGS.scale = newScale;

              physicsObjectsRef.current.forEach((obj) => {
                const newW = obj.baseWidth * newScale;
                const newH = newW * obj.aspectRatio;

                obj.element.style.width = `${newW}px`;
                obj.element.style.height = `${newH}px`;

                const pos = obj.body.position;
                const angle = obj.body.angle;
                const velocity = obj.body.velocity;

                Composite.remove(world, obj.body);

                let newBody: Matter.Body;
                if (obj.isCircle) {
                  const radius = Math.min(newW, newH) / 2;
                  newBody = Bodies.circle(pos.x, pos.y, radius, {
                    restitution: SETTINGS.physics.restitution,
                    friction: SETTINGS.physics.friction,
                    frictionAir: SETTINGS.physics.frictionAir,
                    density: SETTINGS.physics.density,
                    render: { visible: false },
                  });
                } else {
                  newBody = Bodies.rectangle(pos.x, pos.y, newW, newH, {
                    restitution: SETTINGS.physics.restitution,
                    friction: SETTINGS.physics.friction,
                    frictionAir: SETTINGS.physics.frictionAir,
                    density: SETTINGS.physics.density,
                    render: { visible: false },
                  });
                }

                Body.setAngle(newBody, angle);
                Body.setVelocity(newBody, velocity);
                Composite.add(world, newBody);

                obj.body = newBody;
                obj.width = newW;
                obj.height = newH;
              });
            }

            // Always clamp all objects to new bounds during resize
            physicsObjectsRef.current.forEach((obj) => {
              const pos = obj.body.position;
              const minX = obj.width / 2;
              const maxX = newWidth - obj.width / 2;
              const maxY = newHeight - obj.height / 2;

              // Always clamp position to new bounds
              const clampedX = Math.max(minX, Math.min(maxX, pos.x));
              const clampedY = Math.min(maxY, pos.y);

              if (pos.x !== clampedX || pos.y !== clampedY) {
                Body.setPosition(obj.body, {
                  x: clampedX,
                  y: clampedY,
                });
              }
            });
          }, 100);
        };

        window.addEventListener("resize", handleResize);

        cleanupFn = () => {
          window.removeEventListener("resize", handleResize);
          if (resizeTimeout) clearTimeout(resizeTimeout);
          if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
          }
          if (engineRef.current) {
            Engine.clear(engineRef.current);
            engineRef.current = null;
          }
          physicsObjectsRef.current = [];
        };
      }).catch((error: Error) => {
        console.error("Matter.js loading error:", error);
      });
    } // end initPhysics

    return () => {
      observer.disconnect();
      cleanupFn?.();
    };
  }, []);

  return (
    <div
      id="physics-container"
      className="w-[100vw] -ml-[40vw] inlg:w-full inlg:ml-0 h-[25vh] sm:h-[30vh] md:h-[35vh] relative overflow-visible dark:bg-dark bg-light transition-theme"
    >
      <div className="absolute bottom-0 left-0 w-full h-[1px] dark:bg-light/10 bg-dark/10 z-0" />
    </div>
  );
}
