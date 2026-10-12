import { useEffect, useState } from 'react';
import './AdsSection.css';
import api from '../../../api/api.js';

function AdsSection() {
    const [adsSectionData, setAdsSectionData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchForAdsSection = async () => {
            try {
                const res = await api.get(`/landingPage/rlc-ads`);
                setAdsSectionData(res.data.data);
            } catch (err) {
                console.log(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchForAdsSection();
    }, []);

    if (isLoading) {
        return (
            <div className="d-flex w-100 justify-content-center align-items-center" style={{ height: "20rem" }}>
                <div className="spinner-grow text-dark" style={{ width: "4rem", height: "4rem" }} role="status" />
            </div>
        );
    }

    return (
        <div className="ads-section-wrapper w-100 bg-body mt-0">
            <section className="ads-section-container position-relative">
                <video 
                    src={adsSectionData[1]?.media[0]} 
                    alt="Ralph Lauren summer campaign desktop" 
                    className="ads-section-video d-none d-md-block w-100 h-100 object-fit-contain" 
                    autoPlay 
                    loop 
                    muted 
                    playsInline
                />
                <div className="ads-section-text-wrap user-select-none ">
                    <div className="ads-section-text-content text-white text-uppercase">
                        <div className="text-white text-uppercase text-nowrap fs-5 fs-lg-4 text-center">
                            {adsSectionData[0]?.title}
                        </div>
                        <h1 className="text-white text-uppercase text-nowrap display-lg-4 display-2 text-center">
                            {adsSectionData[0]?.brand}
                        </h1>
                        <div className="w-100 d-flex justify-content-center align-items-center">
                      <p className="teext-nowrap border border-1 border-body rounded-1 py-1 px-2 text-uppercase text-center ads-section-shopnow mt-4">
                            listen now
                        </p>
                        </div>

                    </div>
                </div>
            </section>
            
            <video 
                src={!adsSectionData?.forMobile && adsSectionData[0]?.media[0]} 
                alt="Ralph Lauren summer campaign"
                className="ads-section-video d-block d-md-none w-100 object-fit-cover" 
                autoPlay 
                loop 
                muted 
                playsInline
            /> 
        </div>
    );
}

export default AdsSection;