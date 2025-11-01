const DiabetesWidget = () => {
    return (
      <div className="w-full h-[80vh] max-w-5xl mx-auto">
        <h2 className="text-xl font-semibold text-white mb-4">Interactive Anatomy</h2>
        <iframe
          className="w-full h-full rounded-xl shadow-lg border-none"
          src="https://human.biodigital.com/widget/?be=2S0t&background.colors=0,0,0,0,0,0,0,0&initial.hand-hint=true&ui-info=true&ui-fullscreen=true&ui-center=false&ui-dissect=true&ui-zoom=true&ui-help=true&ui-tools-display=primary&uaid=3iSxx"
          title="BioDigital Human Widget"
          allowFullScreen
          loading="lazy"
        />
      </div>
    );
  };
  
  export default DiabetesWidget;
  