import React, { useCallback, useEffect, useRef, useState } from 'react';

interface Position {
  x: number;
  y: number;
}

interface InfiniteCanvasProps {
  children: React.ReactNode;
  moveSpeed?: number;
}

interface PositionedElementProps {
  position: Position;
  children: React.ReactNode;
  label?: string;
}

interface KeyState {
  [key: string]: boolean;
}

interface ElementArrowProps {
  start: Position;
  end: Position;
  color?: string;
  content?: string;
}

const ElementArrow: React.FC<ElementArrowProps> = ({ start, end, color = '#000000', content = '' }) => {
  const [startPoint, setStartPoint] = useState<Position>(start);
  const [endPoint, setEndPoint] = useState<Position>(end);
  const [distance, setDistance] = useState(0);
  const [angle, setAngle] = useState(0);

  useEffect(() => {
    // Calculate intersection points with screen edges
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    // Calculate angle and direction
    setAngle(Math.atan2(end.y - start.y, end.x - start.x));
    setDistance(Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)));

    // Find intersection with screen edges
    let newStart = { ...start };
    let newEnd = { ...end };

    // Extend the line to screen edges
    if (Math.abs(Math.cos(angle)) > Math.abs(Math.sin(angle))) {
      // Horizontal dominant direction
      newStart.x = start.x < end.x ? 0 : screenWidth;
      newStart.y = start.y + Math.tan(angle) * (newStart.x - start.x);

      newEnd.x = start.x < end.x ? screenWidth : 0;
      newEnd.y = start.y + Math.tan(angle) * (newEnd.x - start.x);
    } else {
      // Vertical dominant direction
      newStart.y = start.y < end.y ? 0 : screenHeight;
      newStart.x = start.x + (newStart.y - start.y) / Math.tan(angle);

      newEnd.y = start.y < end.y ? screenHeight : 0;
      newEnd.x = start.x + (newEnd.y - start.y) / Math.tan(angle);
    }

    setStartPoint(newStart);
    setEndPoint(newEnd);
  }, [start, end]);

  return (
    <div
      style={{
        position: 'fixed',
        left: '50%',
        top: '50%',
        transform: `translate(-50%, -50%) translate(${distance * Math.cos(angle)}px, ${distance * Math.sin(angle)}px)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: color,
          color: 'white',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          whiteSpace: 'nowrap',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          transform: `rotate(${angle}rad)`,
        }}
      >
        {content}
      </div>
      <div
        style={{
          width: '20px',
          height: '20px',
          background: color,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          transform: `rotate(${angle}rad)`,
        }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white">
          <path d="M12 19V5M5 12l7-7 7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
};

const FloatingArrow: React.FC<{ position: Position; label: string; viewPosition: Position; onClick?: () => void }> = ({
  position,
  label,
  viewPosition,
  onClick,
}) => {
  const relativePos = {
    x: -viewPosition.x - position.x,
    y: -viewPosition.y - position.y,
  };

  const angle = Math.atan2(-relativePos.y, -relativePos.x);
  const distance = Math.min(Math.sqrt(relativePos.x ** 2 + relativePos.y ** 2) / 4, 100);

  const arrowStyle: React.CSSProperties = {
    position: 'fixed',
    left: '50%',
    top: '50%',
    width: '40px',
    height: '40px',
    transform: `translate(-50%, -50%) translate(${distance * Math.cos(angle)}px, ${distance * Math.sin(angle)}px) rotate(${angle}rad)`,
    cursor: onClick ? 'pointer' : 'default',
    transition: 'transform 0.2s ease-out',
    zIndex: 1000,
    background: 'rgba(255, 255, 255, 0.8)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
  };

  return (
    <div style={arrowStyle} onClick={onClick}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M12 19V5M5 12l7-7 7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div
        style={{
          position: 'absolute',
          bottom: '-20px',
          left: '50%',
          transform: `translateX(-50%) rotate(-${angle}rad)`,
          whiteSpace: 'nowrap',
          fontSize: '12px',
          background: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          padding: '2px 6px',
          borderRadius: '4px',
        }}
      >
        {label}
      </div>
    </div>
  );
};

const PositionedElement: React.FC<PositionedElementProps> = ({ position, children, label }) => (
  <div
    style={{
      position: 'absolute',
      left: position.x,
      top: position.y,
      transform: 'translate(-50%, -50%)',
    }}
  >
    {children}
    <div
      style={{
        position: 'absolute',
        top: '100%',
        left: '50%',
        transform: 'translateX(-50%)',
        marginTop: '8px',
        fontSize: '12px',
        background: 'rgba(0, 0, 0, 0.7)',
        color: 'white',
        padding: '2px 6px',
        borderRadius: '4px',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </div>
  </div>
);

const CoordinatesDisplay: React.FC<{ position: Position }> = ({ position }) => (
  <div
    style={{
      position: 'fixed',
      left: '20px',
      bottom: '20px',
      padding: '8px 12px',
      background: 'rgba(0, 0, 0, 0.7)',
      color: 'white',
      borderRadius: '4px',
      fontFamily: 'monospace',
      fontSize: '14px',
      zIndex: 1000,
      userSelect: 'none',
    }}
  >
    x: {Math.round(position.x)}, y: {Math.round(position.y)}
  </div>
);

export const InfiniteCanvas: React.FC<InfiniteCanvasProps> = ({ children, moveSpeed = 5 }) => {
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState<Position>({ x: 0, y: 0 });
  const [isAnimatingToOrigin, setIsAnimatingToOrigin] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const keysPressed = useRef<KeyState>({});
  const animationFrameId = useRef<number>();

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (isAnimatingToOrigin) return;
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setStartPos({
      x: clientX - position.x,
      y: clientY - position.y,
    });
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!isDragging || isAnimatingToOrigin) return;

      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      setPosition({
        x: clientX - startPos.x,
        y: clientY - startPos.y,
      });
    },
    [isDragging, startPos, isAnimatingToOrigin],
  );

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (isAnimatingToOrigin) return;
      keysPressed.current[e.key.toLowerCase()] = true;
    },
    [isAnimatingToOrigin],
  );

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    keysPressed.current[e.key.toLowerCase()] = false;
  }, []);

  const animateToPosition = useCallback(
    (targetPos: Position) => {
      setIsAnimatingToOrigin(true);
      const startPos = { ...position };
      const startTime = performance.now();
      const duration = 1000;

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const easing = 1 - Math.pow(1 - progress, 3);

        setPosition({
          x: startPos.x + (targetPos.x - startPos.x) * easing,
          y: startPos.y + (targetPos.y - startPos.y) * easing,
        });

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setIsAnimatingToOrigin(false);
        }
      };

      requestAnimationFrame(animate);
    },
    [position],
  );

  const returnToOrigin = useCallback(() => {
    animateToPosition({ x: 0, y: 0 });
  }, [animateToPosition]);

  const updatePosition = useCallback(() => {
    if (isAnimatingToOrigin) return;

    const keys = keysPressed.current;
    let deltaX = 0;
    let deltaY = 0;

    if (keys['w'] || keys['arrowup']) deltaY += moveSpeed;
    if (keys['s'] || keys['arrowdown']) deltaY -= moveSpeed;
    if (keys['a'] || keys['arrowleft']) deltaX += moveSpeed;
    if (keys['d'] || keys['arrowright']) deltaX -= moveSpeed;

    if (deltaX !== 0 || deltaY !== 0) {
      setPosition(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY,
      }));
    }

    animationFrameId.current = requestAnimationFrame(updatePosition);
  }, [moveSpeed, isAnimatingToOrigin]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleMouseMove);
    window.addEventListener('touchend', handleMouseUp);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    animationFrameId.current = requestAnimationFrame(updatePosition);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);

      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [handleMouseMove, handleKeyDown, handleKeyUp, updatePosition]);

  const childrenWithArrows = React.Children.map(children, child => {
    if (React.isValidElement(child) && 'position' in child.props) {
      const elementPosition = child.props.position as Position;
      const label = child.props.label || `(${elementPosition.x}, ${elementPosition.y})`;

      return (
        <>
          <FloatingArrow
            position={elementPosition}
            label={label}
            viewPosition={position}
            onClick={() => animateToPosition({ x: -elementPosition.x, y: -elementPosition.y })}
          />
          {React.cloneElement(child, { label })}
        </>
      );
    }
    return child;
  });

  return (
    <div
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        touchAction: 'none',
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleMouseDown}
      tabIndex={0}
    >
      <div
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          position: 'absolute',
          transition: isDragging || isAnimatingToOrigin ? 'none' : 'transform 0.1s ease-out',
        }}
      >
        {childrenWithArrows}
      </div>
      <FloatingArrow position={{ x: 0, y: 0 }} label="Origin" viewPosition={position} onClick={returnToOrigin} />
      <CoordinatesDisplay position={position} />
    </div>
  );
};

export { PositionedElement, ElementArrow };
export type { Position, PositionedElementProps };
export default InfiniteCanvas;
