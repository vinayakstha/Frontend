import CreatePostCSS from "./CreatePost.module.css";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { API } from "../../environment";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function CreatePost() {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const [categories, setCategories] = useState([]);
    const [userId, setUserId] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`${API.BASE_URL}/api/category`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setCategories(response.data.data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        const fetchCurrentUser = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`${API.BASE_URL}/api/auth/init`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUserId(response.data.data.userId);
            } catch (error) {
                console.error("Error fetching current user:", error);
            }
        };

        fetchCategories();
        fetchCurrentUser();
    }, []);
    async function onSubmit(data) {
        console.log(data);
        try {
            const token = localStorage.getItem("token");

            const formData = new FormData();
            formData.append("file", data.file[0]);

            const uploadResponse = await axios.post(`${API.BASE_URL}/api/file/upload`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            });

            const photoPath = uploadResponse.data.filePath;

            const postData = {
                title: data.title,
                description: data.description,
                content: data.content,
                photo: photoPath,
                categoryId: data.category,
                userId: userId,
            };

            await axios.post(`${API.BASE_URL}/api/post`, postData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success("Post created successfully");
            console.log("Post created successfully");
            navigate("/Post");
        } catch (error) {
            console.error("Error creating post:", error);
        }
    }
    return (
        <div className={CreatePostCSS["main-container"]}>
            <div className={CreatePostCSS["heading"]}>
                <h2>Create a new post</h2>
            </div>
            <form className={CreatePostCSS["create-form"]} onSubmit={handleSubmit(onSubmit)}>
                <div className={CreatePostCSS["input-field"]}>
                    <input type="text" placeholder="Title"  {...register("title", { required: "Title is required" })} />
                </div>
                {errors.title && <p className={CreatePostCSS["error-message"]}>{errors.title.message}</p>}

                <div className={CreatePostCSS["input-field"]}>
                    <input type="text" placeholder="Description" {...register("description", { required: "Description is required" })} />
                </div>
                {errors.description && <p className={CreatePostCSS["error-message"]}>{errors.description.message}</p>}

                <div className={CreatePostCSS["middle-fields"]}>
                    <div className={CreatePostCSS["input-field"]} id={CreatePostCSS["file-input-container"]}>
                        <input type="file" id={CreatePostCSS["file-input"]} {...register("file", { required: "File is required" })} />
                    </div>
                    {errors.file && <p className={CreatePostCSS["error-message"]}>{errors.file.message}</p>}

                    <div className={CreatePostCSS["input-field"]} id={CreatePostCSS["dropdown-container"]}>
                        <select className={CreatePostCSS["select-category"]} {...register("category", { required: "Category is required" })}>
                            {/* <option value="">Select Category</option>
                            <option value="tech">Technology</option>
                            <option value="health">Health</option>
                            <option value="lifestyle">Lifestyle</option> */}
                            <option value="">Select Category</option>
                            {categories.map((category) => (
                                <option key={category.categoryId} value={category.categoryId}>
                                    {category.categoryName}
                                </option>
                            ))}
                        </select>
                    </div>
                    {errors.category && <p className={CreatePostCSS["error-message"]} id={CreatePostCSS["category-error-message"]}>{errors.category.message}</p>}
                </div>

                <div className={CreatePostCSS["input-field"]} id={CreatePostCSS["text-area-input"]}>
                    <textarea placeholder="Content" {...register("content", { required: "Content is required" })}></textarea>
                </div>
                {errors.content && <p className={CreatePostCSS["error-message"]}>{errors.content.message}</p>}
                <div className={CreatePostCSS["create-button-container"]}>
                    <button className={CreatePostCSS["create-button"]}>Create Post</button>
                </div>
            </form >
        </div >
    );
}
export default CreatePost;