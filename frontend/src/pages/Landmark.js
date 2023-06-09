import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { FaMapMarkerAlt } from 'react-icons/fa';
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { getAuth } from "firebase/auth";
import { LikeLandmark } from "../components/LikeLandmark";
import { FavouriteLandmark } from "../components/FavouriteLandmark";

export const Landmark = () => {
    const params = useParams();
    const auth = getAuth();
    const navigate = useNavigate();
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
            } else {
                navigate('/not-found');
            }
        };
        fetchLandmark();
    }, [params.landmarkId, navigate]);

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
                            className="relative w-full overflow-hidden h-[400px]"
                            style={{
                                background: `url(${landmark.imgUrls[index]}) center no-repeat`,
                                backgroundSize: 'cover'
                            }}
                        ></div>
                    </SwiperSlide>
                })}
            </Swiper>
            <div
                className="m-4 flex flex-col md:flex-row max-w-6xl 
                           lg:mx-auto p-4 rounded-lg shadow-lg bg-white 
                           lg:space-x-5"
            >
                <div className="w-full h-[50%] lg:h-[400px]">
                    <p className="text-2xl font-bold mb-3 text-[#222643]">
                        {landmark.name}
                    </p>
                    <p className="flex items-center mt-6 mb-3 font-semibold">
                        <FaMapMarkerAlt className="mr-1 text-green-700" />
                        {landmark.address}
                    </p>
                    <div className="flex justify-start items-center space-x-4 w-[75%]">
                        <p
                            className="bg-blue-600 w-full max-w-[200px] rounded-md p-1 
                                       text-white text-center font-semibold shadow-md"
                        >
                            {landmark.place}
                        </p>
                        <p
                            className="bg-[#169d79] w-full max-w-[200px] rounded-md p-1 
                                       text-white text-center font-semibold shadow-md"
                        >
                            {landmark.type}
                        </p>
                    </div>
                    <p className="mt-3 mb-3">
                        <span className="font-semibold">Description - </span>
                        {landmark.description}
                    </p>
                    <div>
                        {auth && <LikeLandmark id={params.landmarkId} likes={landmark.likes} />}
                        {auth && <FavouriteLandmark id={params.landmarkId} />}
                    </div>
                </div>
                <div className="w-full h-[200px] md:h-[400px] z-10 overflox-x-hidden mt-6 md:mt-0 md:ml-2">
                    <MapContainer
                        center={[landmark.geolocation.lat, landmark.geolocation.lng]}
                        zoom={13}
                        scrollWheelZoom={false}
                        style={{ height: '100%', width: '100%' }}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={[landmark.geolocation.lat, landmark.geolocation.lng]}>
                            <Popup>
                                <p>View in <a target="_blank" rel="noopener noreferrer" href={`https://www.google.com/maps/place/${landmark.address}`}>Google Maps</a></p>
                            </Popup>
                        </Marker>
                    </MapContainer>
                </div>
            </div>
        </main>
    );
};