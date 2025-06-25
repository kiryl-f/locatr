import { useEffect, useRef } from 'react';
import { Viewer } from 'mapillary-js';
import styles from './StreetView.module.scss';

type Props = {
  imageKey: string;
};

export const StreetView = ({ imageKey }: Props) => {
  const viewerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!viewerRef.current || !imageKey) return;

    const viewer = new Viewer({
      container: viewerRef.current,
      imageId: imageKey,
      accessToken: import.meta.env.VITE_MAPILLARY_TOKEN,
      component: {
        cover: false, // hide loading cover
      },
    });

    return () => {
      viewer.remove(); // cleanup on unmount
    };
  }, [imageKey]);

  return <div className={styles.container} ref={viewerRef}></div>;
};
