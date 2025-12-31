import { useEffect } from 'react';

type Props = {
  backgroundColor: string;
  textColor: string;
};

export default function ColorHeader({ backgroundColor, textColor }: Props) {
  useEffect(() => {
    const header = document.getElementById('color-header');
    if (header) {
      header.style.backgroundColor = backgroundColor;
      header.style.color = textColor;
    }
  }, [backgroundColor, textColor]);

  return null;
}

