import {useEffect} from 'react';
import styled from 'styled-components';
export function GoogleAd() {
  useEffect(() => {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  }, []);

  const AdLabel = styled.span`
    font-size: 12px;
  `

  return (
    <div 
      style={{textAlign: 'left',overflow: 'hidden'}}
    >
    <AdLabel>Advertisment</AdLabel>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-5587331919297301"
        data-ad-slot="7752134728"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>

    </div>
  )
}
