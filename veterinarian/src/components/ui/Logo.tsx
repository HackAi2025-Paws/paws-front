import newLogo from '../../assets/logo_paws.png';

export function Logo({ size = 44 }: { size?: number }) {
  return (
    <div
      className="logoMark"
      style={{
        width: size,
        overflow: 'hidden'
      }}
      aria-label="PetLink"
    >
      <img
        src={newLogo}
        alt="PetLink"
        width={size}
        height={size}
        style={{
          objectFit: "cover",
          width: '100%',
          height: '100%'
        }}
      />
    </div>
  );
}

export default Logo;
