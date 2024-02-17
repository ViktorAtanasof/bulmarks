import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Spinner } from "../components/Spinner";
import { getAuth } from "firebase/auth";
import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { handleGeolocation } from "../utils/handleGeolocation";
import { storeImage } from "../services/storageService";
import { SizeButton } from "../components/SizeButton";
import { InputField } from "../components/InputField";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { Landmark, LandmarkParams } from "../types/landmarkTypes";
import { LandmarkFormData } from "../types/formTypes";

export const EditLandmark = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  // Temporary
  // eslint-disable-next-line
  const [geolocationEnabled, setGeolocationEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [landmark, setLandmark] = useState<Landmark | null>(null);
  const [size, setSize] = useState<"small" | "large">("large");
  const [initialValues, setInitialValues] = useState<Partial<LandmarkFormData>>(
    {}
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<LandmarkFormData>({
    defaultValues: {
      size: "large",
      name: "",
      type: "",
      place: "",
      address: "",
      description: "",
      latitude: 0,
      longitude: 0,
      images: {} as FileList,
    },
  });
  const params = useParams<LandmarkParams>();

  useEffect(() => {
    if (landmark && landmark.userRef !== auth.currentUser?.uid) {
      toast.error("You cannot edit this landmark");
      navigate("/");
    }
  }, [landmark, auth.currentUser?.uid, navigate]);

  useEffect(() => {
    setLoading(true);
    const fetchLandmark = async () => {
      if (params.landmarkId) {
        const docRef = doc(db, "landmarks", params.landmarkId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const landmarkData = docSnap.data() as Landmark;
          setLandmark(landmarkData);
          setSize(landmarkData.size);
          setInitialValues({ ...landmarkData });
          setLoading(false);
        } else {
          navigate("/");
          toast.error("Landmark does not exist.");
        }
      }
    };
    fetchLandmark();
  }, [navigate, params.landmarkId]);

  useEffect(() => {
    Object.keys(initialValues).forEach((key) => {
      const fieldName = key as keyof LandmarkFormData;
      setValue(fieldName, initialValues[fieldName]!);
    });
  }, [initialValues, setValue]);

  const onChangeSize = (e: React.MouseEvent<HTMLButtonElement>) => {
    const newSize = e.currentTarget.value as "small" | "large";
    setValue("size", newSize);
    setSize(newSize);
  };

  const onSubmit = async (data: LandmarkFormData) => {
    setLoading(true);
    if (data.images?.length > 6) {
      setLoading(false);
      toast.error("Maximum 6 images are allowed.");
      return;
    }

    let geolocation = {};
    let location;
    if (geolocationEnabled) {
      const result = await handleGeolocation(data);
      geolocation = result.geolocation;
      location = result.location;
      if (location === undefined) {
        setLoading(false);
        toast.error("Please enter a correct address.");
        return;
      }
    } else {
      geolocation = { lat: data.latitude, lng: data.longitude };
    }

    const imgUrls = await Promise.all(
      [...data.images].map((img) => storeImage(img))
    ).catch((error) => {
      setLoading(false);
      toast.error("Images not uploaded.");
      return;
    });

    const formDataCopy = {
      ...data,
      imgUrls,
      geolocation,
      timestamp: serverTimestamp(),
      userRef: auth.currentUser?.uid,
    };
    const { images, latitude, longitude, ...formDataWithoutUnwantedProps } =
      formDataCopy;

    if (params.landmarkId) {
      const docRef = doc(db, "landmarks", params.landmarkId);
      await updateDoc(docRef, formDataWithoutUnwantedProps);
      setLoading(false);
      toast.success("Landmark edited succesfully.");
      navigate(`/category/${formDataCopy.size}/${docRef.id}`);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <main className="max-w-md px-2 mx-auto">
      <h1 className="text-3xl text-center mt-6 font-bold text-secondary-color">
        Edit Landmark
      </h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <p className="text-lg mt-6 font-semibold text-secondary-color">
          Small / Large
        </p>
        <div className="flex">
          <SizeButton onChangeSize={onChangeSize} size={size} />
        </div>
        <InputField
          label="Name"
          name="name"
          placeholder="Name"
          register={register}
          errors={errors}
          minLength={5}
          maxLength={80}
          required={true}
        />
        <InputField
          label="Type"
          name="type"
          placeholder="Type"
          register={register}
          errors={errors}
          minLength={5}
          maxLength={30}
          required={true}
        />
        <InputField
          label="City / Town / Village"
          name="place"
          placeholder="Location"
          register={register}
          errors={errors}
          minLength={4}
          maxLength={20}
          required={true}
        />
        <label
          htmlFor="address"
          className="text-lg font-semibold block text-secondary-color"
        >
          Address
        </label>
        <textarea
          id="address"
          {...register("address", {
            required: true,
          })}
          placeholder="Address"
          className={`w-full px-4 py-2 text-xl 
                      text-secondary-color bg-white dark:bg-ldark-color border border-gray-300 
                      rounded transition duration-150 ease-in-out focus:text-accent-color
                      focus:outline-none focus:ring-0 focus:border-accent-color dark:placeholder-gray-300 mb-4
                    ${
                      errors.address && "border-red-600 border-1 dark:border-2"
                    }`}
        />
        {errors.address && (
          <div className="mb-4">
            {errors.address.type === "required" && (
              <p className="text-red-500">Address can't be an empty string.</p>
            )}
          </div>
        )}
        {!geolocationEnabled && (
          <div className="flex space-x-6 justify-start mb-6">
            <div>
              <label
                htmlFor="latitude"
                className="text-lg font-semibold block text-secondary-color"
              >
                Latitude
              </label>
              <input
                type="number"
                id="latitude"
                {...register("latitude", {
                  required: true,
                })}
                required
                min="-90"
                max="90"
                className="w-full px-4 py-2 text-xl 
                text-secondary-color bg-white dark:bg-ldark-color border border-gray-300 
                rounded transition duration-150 ease-in-out focus:text-accent-color
                focus:outline-none focus:ring-0 focus:border-accent-color dark:placeholder-gray-300
                text-center"
              />
            </div>
            <div>
              <label
                htmlFor="longitude"
                className="text-lg font-semibold block text-secondary-color"
              >
                Longitude
              </label>
              <input
                type="number"
                id="longitude"
                {...register("longitude", {
                  required: true,
                })}
                required
                min="-180"
                max="180"
                className="w-full px-4 py-2 text-xl 
                text-secondary-color bg-white dark:bg-ldark-color border border-gray-300 
                rounded transition duration-150 ease-in-out focus:text-accent-color
                focus:outline-none focus:ring-0 focus:border-accent-color dark:placeholder-gray-300
                text-center "
              />
            </div>
          </div>
        )}
        <label htmlFor="description" className="text-lg font-semibold block text-secondary-color">
          Description
        </label>
        <textarea
          id="description"
          {...register("description", {
            required: true,
            minLength: 3,
            maxLength: 600,
          })}
          placeholder="Description"
          required
          className={`w-full px-4 py-2 text-xl 
          text-secondary-color bg-white dark:bg-ldark-color border border-gray-300 
          rounded transition duration-150 ease-in-out focus:text-accent-color
          focus:outline-none focus:ring-0 focus:border-accent-color dark:placeholder-gray-300 mb-4
                    ${errors.description && "border-red-600 border-1"}`}
        />
        {errors.description && (
          <div className="mb-4">
            {errors.description.type === "required" && (
              <p className="text-red-500">
                Description can't be an empty string.
              </p>
            )}
            {errors.description.type === "minLength" && (
              <p className="text-red-500">
                Description must be at least 3 characters long.
              </p>
            )}
            {errors.description.type === "maxLength" && (
              <p className="text-red-500">
                Description must be less than 600 characters long.
              </p>
            )}
          </div>
        )}
        <div className="mb-4 relative">
          <label htmlFor="images" className="text-lg font-semibold block text-secondary-color">
            Images
          </label>
          <div className="group absolute left-16 top-2">
            <AiOutlineInfoCircle className="cursor-pointer text-accent-color" />
            <span
              className="absolute top-[-10px] left-5 whitespace-nowrap scale-0 
                                rounded bg-slate-700 p-2 text-xs text-white group-hover:scale-100"
            >
              Use horizontal images for the best visualization.
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-300 my-1">
            The first image will be the cover (max 6 images)
          </p>
          <input
            type="file"
            id="images"
            {...register("images", {
              required: true,
            })}
            accept=".jpg,.png,.jpeg"
            multiple
            className="w-full px-3 py-1.5 text-gray-700 bg-white border 
                            border-gray-300 rounded transition duration-150 ease-in-out
                            focus:bg-white focus:border-slate-600"
          />
          {errors.images && (
            <div className="mb-4">
              {errors.images.type === "required" && (
                <p className="text-red-500">At least 1 image is required.</p>
              )}
            </div>
          )}
        </div>
        <button
          type="submit"
          className="mb-6 w-full px-7 py-3 bg-green-600 text-white
                               font-medium text-sm uppercase rounded shadow-md
                               hover:bg-green-700 transition duration-150 ease-in-out
                               active:bg-green-800"
        >
          Edit Landmark
        </button>
      </form>
    </main>
  );
};
