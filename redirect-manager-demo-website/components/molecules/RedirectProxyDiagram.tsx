import Image from 'next/image';

type DiagramVariant = 'compact' | 'detailed';

export interface RedirectProxyDiagramProps {
  variant?: DiagramVariant;
  className?: string;
}

export function RedirectProxyDiagram({
  variant = 'compact',
  className,
}: RedirectProxyDiagramProps) {
  const isDetailed = variant === 'detailed';

  const src = isDetailed
    ? '/diagram-redirect-manager-detailed.png'
    : '/diagram-redirect-manager.png';

  const alt = isDetailed
    ? 'Diagram: Client sends a request to Redirect Manager, which either returns a redirect (301/302) or proxies/falls back to the website/SPA. Redirect rules are stored in a database and managed via the API.'
    : 'Diagram: Client requests go to Redirect Manager which redirects or proxies to your website.';

  const width = isDetailed ? 3102 : 3802;
  const height = isDetailed ? 1289 : 1051;

  return (
    <figure className={className}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="w-full h-auto"
        sizes="(max-width: 768px) 100vw, 800px"
      />
    </figure>
  );
}
