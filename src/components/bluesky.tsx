// Simple bluesky like/comment integration.
import { BlueskyComments } from 'bluesky-comments';
import 'bluesky-comments/bluesky-comments.css';
import '../sass/bluesky.scss';

export default function Comments({ uri }: { uri?: string }) {
  if (!uri) {
    return <BlueskyComments author="bencuan.me" />;
  }
  return <BlueskyComments uri={uri} />;
}
