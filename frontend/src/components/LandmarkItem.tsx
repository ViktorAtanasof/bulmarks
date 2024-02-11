import { Link } from "react-router-dom";
import { MdLocationOn, MdEdit } from 'react-icons/md';
import { FaTrash } from 'react-icons/fa';
import { Landmark } from '../types/landmarkTypes';

type LandmarkItemProps = {
    landmark: Landmark;
    id: string;
    onDelete?: (id: string) => void;
    onEdit?: (id: string) => void;
};

export const LandmarkItem = ({
    landmark,
    id,
    onDelete,
    onEdit,
}: LandmarkItemProps) => {
    return (
        <li className="relative bg-primary-color flex flex-col justify-between items-center 
                       shadow-md shadow-box-color hover:shadow-box-color hover:shadow-xl rounded-md overflow-hidden
                       transition-shadow duration-150 m-[10px]">
            <Link to={`/category/${landmark.size}/${id}`} className="contents">
                <img
                    className="h-[170px] w-full object-cover hover:scale-105 transition-scale 
                               duration-200 ease-in"
                    loading="lazy"
                    src={landmark.imgUrls[0]}
                    alt="landmark"
                />
                <div className="w-full p-[10px]">
                    <div className="flex items-center space-x-1">
                        <MdLocationOn className="h-4 w-4 text-green-600" />
                        <p
                            className="font-semibold text-sm mb-[2px] text-gray-600 dark:text-gray-300 truncate"
                        >
                            {landmark.place}
                        </p>
                    </div>
                    <p className="font-semibold mt-0 text-xl text-secondary-color truncate">{landmark.name}</p>
                    <p className="text-[#457b9d] dark:text-[#5dacdc] mt-2 font-semibold">{landmark.type}</p>
                </div>
            </Link>
            {onDelete && (
                <FaTrash
                    className="absolute bottom-2 right-2 h-[14px] cursor-pointer text-red-500"
                    onClick={() => onDelete(landmark.id)}
                />
            )}
            {onEdit && (
                <MdEdit
                    className="absolute bottom-2 right-7 h-4 cursor-pointer text-secondary-color"
                    onClick={() => onEdit(landmark.id)}
                />
            )}
        </li>
    );
};