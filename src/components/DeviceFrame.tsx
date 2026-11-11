import type { ReactNode } from 'react';

type Device = 'mac' | 'ipad' | 'iphone';

interface DeviceFrameProps {
  device: Device;
  children: ReactNode;
  className?: string;
  /** When true, outer bezel is the measured alignment edge (default true). */
  alignEdge?: boolean;
}

const ASPECT: Record<Device, string> = {
  mac: '16 / 10',
  ipad: '3 / 4',
  iphone: '9 / 19.5',
};

export default function DeviceFrame({
  device,
  children,
  className = '',
  alignEdge = true,
}: DeviceFrameProps) {
  const alignProps = alignEdge
    ? ({ 'data-align': 'device', 'data-testid': 'device-outer' } as const)
    : {};

  if (device === 'mac') {
    return (
      <div className={`device-outer relative w-full ${className}`} {...alignProps}>
        {/* Shadow on a sibling layer so it never shifts the border box */}
        <div
          className="pointer-events-none absolute inset-0 -z-10 rounded-[18px]"
          style={{ boxShadow: '0 30px 80px rgba(0,0,0,0.35)' }}
          aria-hidden="true"
        />
        <div className="rounded-[18px] bg-[#1c1c1e] p-[10px]">
          <div
            className="relative overflow-hidden rounded-[10px] bg-black"
            style={{ aspectRatio: ASPECT.mac }}
          >
            {children}
          </div>
        </div>
        <div className="mx-auto mt-[-2px] h-3 w-[62%] rounded-b-[10px] bg-[#2c2c2e]" />
        <div className="mx-auto h-1.5 w-[72%] rounded-b-[6px] bg-[#3a3a3c]" />
      </div>
    );
  }

  if (device === 'ipad') {
    return (
      <div className={`device-outer relative ${className}`} {...alignProps}>
        <div
          className="pointer-events-none absolute inset-0 -z-10 rounded-[28px]"
          style={{ boxShadow: '0 24px 60px rgba(0,0,0,0.3)' }}
          aria-hidden="true"
        />
        <div className="rounded-[28px] bg-[#1c1c1e] p-[12px]">
          <div
            className="relative overflow-hidden rounded-[18px] bg-black"
            style={{ aspectRatio: ASPECT.ipad }}
          >
            {children}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`device-outer relative w-full max-w-[280px] ${className}`}
      {...alignProps}
    >
      <div
        className="pointer-events-none absolute inset-0 -z-10 rounded-[36px]"
        style={{ boxShadow: '0 24px 60px rgba(0,0,0,0.35)' }}
        aria-hidden="true"
      />
      <div className="rounded-[36px] bg-[#1c1c1e] p-[10px]">
        <div className="absolute top-3 left-1/2 z-10 h-5 w-24 -translate-x-1/2 rounded-full bg-black" />
        <div
          className="relative overflow-hidden rounded-[28px] bg-black"
          style={{ aspectRatio: ASPECT.iphone }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
