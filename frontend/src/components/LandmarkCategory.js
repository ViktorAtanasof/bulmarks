import { Link } from "react-router-dom";
import { LandmarkItem } from "./LandmarkItem";

export const LandmarkCategory = ({
    landmarks,
    category,
}) => {
    return (
        <div className="m-2 mb-6">
            <h2 className="px-3 text-2xl mt-6 font-semibold">
                {category === "small" ? "Small landmarks" : "Large landmarks"}
            </h2>
            <Link to={`/category/${category}`}>
                <p className="px-3 text-sm text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out">
                    Show more {category} landmarks
                </p>
            </Link>
            <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ">
                {landmarks.map((landmark) => (
                    <LandmarkItem
                        key={landmark.id}
                        landmark={landmark.data}
                        id={landmark.id}
                    />
                ))}
            </ul>
        </div>
    );
};