import './research-syllabus.scss';

interface ResearchBannerProps {
  subtitle?: string;
  edition?: string;
}

export default function ResearchBanner({
  subtitle = "Ben's",
  edition = '1st edition • jan. 2026',
}: ResearchBannerProps) {
  return (
    <div className="research-banner">
      <div className="research-banner-overlay" />
      <div className="research-banner-content">
        <p className="research-banner-subtitle">{subtitle}</p>
        <h1 className="research-banner-title">
          <span className="research-banner-title-line">Research</span>
          <span className="research-banner-title-line">
            Syllabus
            <img
              src="/img/kevin2.png"
              alt="Kevin the dinosaur"
              className="research-banner-dino research-banner-dino-desktop"
            />
          </span>
        </h1>
        {/* Mobile dinosaur - on its own line */}
        <img
          src="/img/kevin2.png"
          alt="Kevin the dinosaur"
          className="research-banner-dino research-banner-dino-mobile"
        />
        <p className="research-banner-edition">{edition}</p>
      </div>
    </div>
  );
}
