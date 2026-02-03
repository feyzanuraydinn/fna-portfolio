export type PhysicsBodyType = "circle" | "rectangle";

export interface PhysicsObjectConfig {
  imageUrl: string;
  bodyType: PhysicsBodyType;
  /** Base width in pixels — actual render size scales responsively (0.5x-0.7x). */
  width: number;
}

export const physicsObjects: PhysicsObjectConfig[] = [
  { imageUrl: "/images/physics/arcane.svg", bodyType: "circle", width: 120 },
  { imageUrl: "/images/physics/axebass.svg", bodyType: "rectangle", width: 130 },
  { imageUrl: "/images/physics/bmo.svg", bodyType: "rectangle", width: 120 },
  { imageUrl: "/images/physics/cigolayt.svg", bodyType: "rectangle", width: 140 },
  { imageUrl: "/images/physics/fleabag.svg", bodyType: "rectangle", width: 100 },
  { imageUrl: "/images/physics/flower4u.svg", bodyType: "circle", width: 80 },
  { imageUrl: "/images/physics/grannysmith.svg", bodyType: "circle", width: 60 },
  { imageUrl: "/images/physics/lemongrab.svg", bodyType: "rectangle", width: 70 },
  { imageUrl: "/images/physics/me.svg", bodyType: "rectangle", width: 150 },
  { imageUrl: "/images/physics/scott.svg", bodyType: "rectangle", width: 140 },
  { imageUrl: "/images/physics/us.svg", bodyType: "rectangle", width: 120 },
];
