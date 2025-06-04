import React, { useEffect } from 'react';

const GoogleAd = () => {
    useEffect(() => {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
    }, []);

    return (
        <ins className="adsbygoogle"
             style={{ display: 'block', textAlign: 'center', width: '768px'}}
             data-ad-layout="in-article"
             data-ad-format="fluid"
             data-ad-client="ca-pub-1371301044344210"
             data-full-width-responsive="true"
             data-ad-slot="1346194813"></ins>
    );
};

export default GoogleAd;
