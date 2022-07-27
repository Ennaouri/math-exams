import {useEffect} from 'react';

export function GoogleAd() {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error(err);
    }
  }, []);

  return (
<ins className="adsbygoogle mt-2 mb-2"
     style={{ display: "block" }}
     data-ad-client="ca-pub-5587331919297301"
     data-ad-slot="7752134728"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
  );
}
