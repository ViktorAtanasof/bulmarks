import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Spinner } from "../components/Spinner";
import { db } from "../firebase";
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, {
    EffectFade,
    Autoplay,
    Navigation,
    Pagination
} from 'swiper';
import 'swiper/css/bundle';

export const Landmark = () => {
    const params = useParams();
    const [landmark, setLandmark] = useState(null);
    const [loading, setLoading] = useState(true);
    SwiperCore.use([Autoplay, Navigation, Pagination]);

    useEffect(() => {
        const fetchLandmark = async () => {
            const docRef = doc(db, 'landmarks', params.landmarkId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setLandmark(docSnap.data());
                setLoading(false);
            }
        };
        fetchLandmark();
    }, [params.landmarkId]);

    if (loading) {
        return <Spinner />
    };

    return (
        <main>
            <Swiper
                slidesPerView={1}
                navigation
                pagination={{ type: 'progressbar' }}
                effect='fade'
                modules={[EffectFade]}
                autoplay={{ delay: 3000 }}
            >
                {landmark.imgUrls.map((url, index) => {
                    return <SwiperSlide key={index}>
                        <div
                            className="relative w-full overflow-hidden h-[300px]"
                            style={{
                                background: `url(${landmark.imgUrls[index]}) center no-repeat`,
                                backgroundSize: 'cover'
                            }}
                        >

                        </div>
                    </SwiperSlide>
                })}
            </Swiper>
        </main>
    );
};