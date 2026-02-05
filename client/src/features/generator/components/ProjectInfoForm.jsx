import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useProject } from "../../../context/ProjectContext";
import GenerateButton from '../../../components/common/GenerateButton';
import backSvg from '../../../assets/back-svgrepo-com.svg';
import resetSvg from '../../../assets/reset-svgrepo-com.svg';

import {
    User,
    FileText,
    Code,
    AlertCircle,
    CheckCircle2,
    Sparkles
} from 'lucide-react';
import { Navbar, Footer } from '../../../components/layout';

export default function ProjectInfoForm({ onBack }) {
    const [formData, setFormData] = useState({
        projectName: '',
        projectTitle: '',
        description: ''
    });

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const { stack, features, setGeneratedFile, projectInfo, setProjectInfo } = useProject();



    const validateField = (name, value) => {
        switch (name) {
            case 'projectName':
                if (!value.trim()) return 'Project name is required';
                if (value.length < 5) return 'Project name must be at least 5 characters';
                if (!/^[a-zA-Z0-9\s\-_]+$/.test(value)) return 'Only letters, numbers, spaces, hyphens, and underscores allowed';
                return '';
            case 'projectTitle':
                if (!value.trim()) return 'Project Title is required';
                if (value.length < 7) return 'Project Title must be at least 7 characters';
                return '';
            case 'description':
                if (!value.trim()) return 'Project description is required';
                if (value.length < 10) return 'Description must be at least 10 characters';
                if (value.length > 200) return 'Description must be less than 200 characters';
                return '';
            default:
                return '';
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));

        const error = validateField(name, value);
        setErrors(prev => ({ ...prev, [name]: error }));
    };

    const handleSubmit = async (e) => {
        e?.preventDefault?.();
        setIsSubmitting(true);
        try {
            // Save to global context
            console.log(formData)

            setProjectInfo({
                name: formData.projectName,
                title: formData.projectTitle,
                description: formData.description
            })

            // Prepare payload
            const payload = {
                stack,            // from useProject()
                features,         // from useProject()
                projectName: formData.projectName,
                projectTitle: formData.projectTitle,
                projectDescription: formData.description,
            };

            // Make API call to backend
            const response = await axios.post("http://localhost:4000/generate", payload, {
                responseType: "blob", // backend will return .zip file
                // Security hardening: allow backend to set HttpOnly cookies (browser id binding).
                withCredentials: true,
            });

            // Trigger file download
            const blob = new Blob([response.data], { type: "application/zip" });
            const fileUrl = window.URL.createObjectURL(blob);
            console.log(projectInfo)

            const fileCount = response.headers['x-file-count'] || 10;
            const projectId = response.headers['x-project-id'] || null;
            // We can use the zip size (blob.size) or the uncompressed size from header
            // User asked for "right file size", usually implies the download size, but let's stick to blob size for "download size"
            // or we can show uncompressed. Let's show blob size as it's what they get. 
            // Actually, let's use the blob size for the UI "File Size" label usually refers to the download.

            setGeneratedFile({
                url: fileUrl,
                fileName: `${formData.projectName}.zip`,
                fileSize: `${(blob.size / 1024).toFixed(2)} KB`,
                filesCount: fileCount,
                projectId
            });
            navigate("/success");
        } catch (error) {
            console.error("Error generating project:", error);
            alert("Something went wrong while generating your project.");
            setIsSubmitting(false);
        }
    };

    const isFieldValid = (fieldName) => {
        return touched[fieldName] && !errors[fieldName] && formData[fieldName].trim();
    };

    const isFieldInvalid = (fieldName) => {
        return touched[fieldName] && errors[fieldName];
    };

    const isFormValid = () => {
        return Object.keys(formData).every(key =>
            formData[key].trim() && !validateField(key, formData[key])
        );
    };

    const fields = [
        {
            name: 'projectName',
            label: 'Project Name',
            placeholder: 'my-awesome-app',
            icon: <Code className="w-5 h-5" />,
            type: 'text',
            maxLength: 50
        },
        {
            name: 'projectTitle',
            label: 'Project Title',
            placeholder: 'AI Powered Food Delivery Web-Application',
            icon: <User className="w-5 h-5" />,
            type: 'text',
            maxLength: 100
        },
        {
            name: 'description',
            label: 'Project Description',
            placeholder: 'A brief description of project which can help to generate README.md file',
            icon: <FileText className="w-5 h-5" />,
            type: 'textarea',
            maxLength: 1500
        }
    ];

    return (
        <>
            <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white p-8">
                <div className="max-w-2xl mx-auto">

                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center space-x-3 mb-4">

                            <h1 className="text-3xl md:text-4xl font-bold bg-white bg-clip-text text-transparent">
                                Project Information
                            </h1>
                        </div>
                        <p className="text-gray-300">
                            Tell us about your project so we can customize your boilerplate
                        </p>
                    </div>

                    {/* Form */}
                    <div className="space-y-6">
                        <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-gray-700 p-6 md:p-8">
                            <div className="space-y-6">

                                {fields.map((field) => (
                                    <div key={field.name} className="space-y-2">
                                        {/* Label */}
                                        <label
                                            htmlFor={field.name}
                                            className="block text-sm font-medium text-gray-200 mb-3"
                                        >
                                            {field.label}
                                            <span className="text-red-400 ml-1">*</span>
                                        </label>

                                        {/* Input Container */}
                                        <div className="relative">
                                            {/* Icon */}
                                            <div className={`
                      absolute left-4 transition-colors duration-300 z-10
                      ${field.type === 'textarea' ? 'top-3' : 'top-1/2 transform -translate-y-1/2'}
                      ${isFieldValid(field.name)
                                                    ? 'text-green-400'
                                                    : isFieldInvalid(field.name)
                                                        ? 'text-red-400'
                                                        : 'text-gray-400'
                                                }
                    `}>
                                                {field.icon}
                                            </div>

                                            {/* Input/Textarea */}
                                            {field.type === 'textarea' ? (
                                                <textarea
                                                    id={field.name}
                                                    name={field.name}
                                                    value={formData[field.name]}
                                                    onChange={handleInputChange}
                                                    onBlur={handleBlur}
                                                    placeholder={field.placeholder}
                                                    maxLength={field.maxLength}
                                                    rows={4}
                                                    className={`
                          w-full pl-14 pr-4 py-4 pt-2 bg-black/30 border rounded-xl text-white placeholder-gray-400 themed-scrollbar
                          focus:outline-none focus:ring-2 transition-all duration-300 resize-none
                          ${isFieldValid(field.name)
                                                            ? 'border-green-500 focus:ring-green-500/50 bg-green-500/5'
                                                            : isFieldInvalid(field.name)
                                                                ? 'border-red-500 focus:ring-red-500/50 bg-red-500/5'
                                                                : 'border-gray-600 focus:border-blue-500 focus:ring-blue-500/50 hover:border-gray-500'
                                                        }
                        `}
                                                />
                                            ) : (
                                                <input
                                                    type={field.type}
                                                    id={field.name}
                                                    name={field.name}
                                                    value={formData[field.name]}
                                                    onChange={handleInputChange}
                                                    onBlur={handleBlur}
                                                    placeholder={field.placeholder}
                                                    maxLength={field.maxLength}
                                                    className={`
                          w-full pl-14 pr-12 py-4 bg-black/30 border rounded-xl text-white placeholder-gray-400 
                          focus:outline-none focus:ring-2 transition-all duration-300
                          ${isFieldValid(field.name)
                                                            ? 'border-green-500 focus:ring-green-500/50 bg-green-500/5'
                                                            : isFieldInvalid(field.name)
                                                                ? 'border-red-500 focus:ring-red-500/50 bg-red-500/5'
                                                                : 'border-gray-600 focus:border-blue-500 focus:ring-blue-500/50 hover:border-gray-500'
                                                        }
                        `}
                                                />
                                            )}

                                            {/* Validation Icon */}
                                            {field.type !== 'textarea' && (
                                                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                                                    {isFieldValid(field.name) && (
                                                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                                                    )}
                                                    {isFieldInvalid(field.name) && (
                                                        <AlertCircle className="w-5 h-5 text-red-400" />
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {/* Character Count */}
                                        <div className="flex justify-between items-center">
                                            {/* Error Message */}
                                            <div className="min-h-[20px]">
                                                {errors[field.name] && (
                                                    <p className="text-red-400 text-sm flex items-center space-x-1 animate-in slide-in-from-left duration-300">
                                                        <AlertCircle className="w-4 h-4" />
                                                        <span>{errors[field.name]}</span>
                                                    </p>
                                                )}
                                            </div>

                                            {/* Character Counter */}
                                            <span className={`
                      text-xs transition-colors duration-300
                      ${formData[field.name].length > field.maxLength * 0.8
                                                    ? 'text-yellow-400'
                                                    : 'text-gray-500'
                                                }
                    `}>
                                                {formData[field.name].length}/{field.maxLength}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="grid grid-cols-[3rem_minmax(0,1fr)_3rem] gap-2 items-center w-full sm:grid-cols-[auto_auto_auto] sm:gap-6 sm:justify-center">
                            {/* Mobile: plain buttons */}
                            <button
                                type="button"
                                aria-label="Back"
                                onClick={onBack}
                                className="sm:hidden w-12 h-12 aspect-square rounded-full shrink-0 grid place-items-center bg-black border border-gray-700 hover:bg-gray-800 transition-all"
                            >
                                <img
                                    src={backSvg}
                                    alt=""
                                    aria-hidden="true"
                                    draggable="false"
                                    className="h-5 w-5 object-contain filter brightness-0 invert"
                                />
                            </button>

                            {/* Desktop/tablet: GenerateButton */}
                            <div className="hidden sm:block">
                                <GenerateButton label='Back' className='bg-black hover:bg-gray-800 transition-all' onClick={onBack} />
                            </div>

                            {/* Mobile: plain button */}
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={!isFormValid() || isSubmitting}
                                className="sm:hidden w-full min-w-0 h-12 px-5 bg-[#161B22] border border-gray-700 rounded-full cursor-pointer transition-all duration-300 hover:border-blue-500/50 hover:bg-[#1f2631] active:scale-95 shadow-xl disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100"
                            >
                                <span className="text-base font-semibold text-gray-200">Create Project</span>
                            </button>

                            {/* Desktop/tablet: GenerateButton */}
                            <div className="hidden sm:block">
                                <GenerateButton
                                    label='Create Project'
                                    wrapperClassName="p-0 sm:p-4"
                                    className="h-12 sm:h-auto"
                                    onClick={handleSubmit}
                                    disabled={!isFormValid() || isSubmitting}
                                />
                            </div>

                            {/* Mobile: plain buttons */}
                            <button
                                type="button"
                                aria-label="Reset"
                                onClick={() => {
                                    setFormData({ projectName: '', projectTitle: '', description: '' });
                                    setErrors({});
                                    setTouched({});
                                }}
                                className="sm:hidden w-12 h-12 aspect-square rounded-full shrink-0 grid place-items-center bg-red-500/20 border border-red-500/30 hover:bg-red-500/30 hover:border-red-500/40 transition-all"
                            >
                                <img
                                    src={resetSvg}
                                    alt=""
                                    aria-hidden="true"
                                    draggable="false"
                                    className="h-5 w-5 object-contain filter brightness-0 invert"
                                />
                            </button>

                            {/* Desktop/tablet: GenerateButton */}
                            <div className="hidden sm:block">
                                <GenerateButton
                                    label='Reset'
                                    className='bg-black hover:bg-red-600 transition-all'
                                    onClick={() => {
                                        setFormData({ projectName: '', projectTitle: '', description: '' });
                                        setErrors({});
                                        setTouched({});
                                    }}
                                />
                            </div>
                        </div>

                        {/* Form Status */}
                        {isFormValid() && (
                            <div className="text-center">
                                <p className="text-green-400 text-sm flex items-center justify-center space-x-2">
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span>All fields completed! Ready to generate your project.</span>
                                </p>
                            </div>
                        )}
                    </div>
                </div>
                <Footer />
            </div>
        </>
    );
}
