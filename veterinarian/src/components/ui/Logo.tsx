export function Logo({ size = 44 }: { size?: number }) {
  return (
    <div
      className="logoMark"
      style={{ width: size, height: size }}
      aria-label="PetLink"
    >
      <img
        src="/paw.png" // tu archivo en la carpeta public
        alt="PetLink"
        width={size}
        height={size}
        style={{ objectFit: "contain" }}
      />
    </div>
  );
}

export default Logo;
