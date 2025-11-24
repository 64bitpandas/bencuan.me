type ColorDotProps = {
  color: string;
  name: string;
};

export const ColorDot = ({ color, name }: ColorDotProps) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
    <span
      style={{
        display: 'inline-block',
        width: '1rem',
        height: '1rem',
        borderRadius: '50%',
        backgroundColor: color,
        border: '1px solid #ccc',
      }}
      aria-label={`Color swatch for ${name}`}
    />
    {name}
  </span>
);

