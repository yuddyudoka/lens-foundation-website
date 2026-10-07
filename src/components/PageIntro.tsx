type PageIntroProps = {
  eyebrow: string;
  title: string;
  titleId: string;
  nodeId?: string;
};

export function PageIntro({ eyebrow, title, titleId, nodeId }: PageIntroProps) {
  return (
    <section className="page-intro" data-node-id={nodeId} aria-labelledby={titleId}>
      <div className="content-wrapper page-intro-layout">
        <p className="page-intro-eyebrow">{eyebrow}</p>
        <h1 id={titleId}>{title}</h1>
      </div>
    </section>
  );
}
