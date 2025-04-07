import { faVolumeUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../sass/pronunciation.scss';

type Props = {
  word: string;
  ipa: string;
  audioFile: string;
};

const Pronunciation = ({ word, ipa, audioFile }: Props) => {
  const playAudio = () => {
    const audio = new Audio(audioFile);
    audio.addEventListener('canplaythrough', () => {
      audio.play().catch(e => console.error('Error playing audio:', e));
    });
  };

  return (
    <span className="pronunciation">
      <span className="ipa">
        ({ipa}{' '}
        <button onClick={playAudio} className="audio-button" aria-label={`Pronounce ${word}`}>
          <FontAwesomeIcon icon={faVolumeUp} />
        </button>
        )
      </span>{' '}
    </span>
  );
};

export default Pronunciation;
