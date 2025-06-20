import React from 'react';
import frame from "@/assets/Frame1.svg"
import vector3 from "@/assets/Vector3.svg"
import circle from "@/assets/circle-check.svg"
import star from "@/assets/star.svg"


interface SoftwareCardProps {
    icon: string;
    title: string;
    description: string;
    rating: number;
    reviews: number;
    price: string;
    isOfficial?: boolean;
    backgroundColor?: string;
}

const SoftwareCard: React.FC<SoftwareCardProps> = ({
                                                       icon,
                                                       title,
                                                       description,
                                                       rating,
                                                       reviews,
                                                       price,
                                                       isOfficial = false,
                                                       backgroundColor = "#F8F9FB"
                                                   }) => {

    return (
        <div
            className="w-full border border-[#E1EAF6] rounded-lg p-6 flex flex-col gap-4 hover:shadow-md transition-shadow duration-200"
            style={{backgroundColor}}
        >
            <div className={'flex flex-row gap-4 justify-between'}>
                <div className="flex-shrink-0">
                    <div
                        className="rounded-[5px] bg-white flex items-center justify-center border border-gray-100 shadow-sm">
                        <img
                            src={icon}
                            alt={title}
                            className="sm:w-[90px] sm:h-[90px] w-[60px] h-[60px] object-contain"
                        />
                    </div>
                </div>

                <div className="flex-1 flex flex-col gap-2 justify-center">
                    <div className="flex items-end gap-2">
                        <h3 className="text-[20px] font-semibold text-[#333333]">{title}</h3>
                        <img
                            src={frame}
                            alt="arrow"
                            className="h-[20px] w-[20px] mb-[4px]"
                        />
                    </div>

                    {isOfficial && (
                        <div
                            className={'flex sm:hidden w-fit items-center justify-center gap-1 px-3 py-[1px] rounded-[15px] bg-[#00A1B3]'}>
                            <img
                                src={vector3}
                                alt="official"
                                className="h-[16px] w-[11px]"
                            />
                            <span className="text-[14px] font-[400] text-white">
                                Official software
                            </span>
                        </div>
                    )}

                    <div className={'hidden sm:flex items-center gap-2'}>
                        <img
                            src={circle}
                            alt="check"
                            className="h-[16px] w-[16px]"
                        />
                        <span className={'text-[14px] font-normal text-[#333333]'}>
                        This software is designed to work with any site
                    </span>
                    </div>

                    <div className="hidden sm:flex items-center gap-3 mb-3">
                        <div
                            className="flex items-center justify-center gap-1 w-[60px] h-[24px] rounded-[12px] bg-[#E1EAF6]">
                            <span className="text-[14px] font-[600] text-[#333333]">{rating}</span>
                            <img
                                src={star}
                                alt="star"
                                className="h-[14px] w-[14px]"
                            />
                        </div>

                        <div>
                            <span className="text-[14px] font-[400] text-[#5B6A7D]">{reviews} Reviews</span>
                        </div>

                        {isOfficial && (
                            <div
                                className={'flex items-center justify-center gap-1 px-3 py-[1px] rounded-[15px] bg-[#00A1B3]'}>
                                <img
                                    src={vector3}
                                    alt="official"
                                    className="h-[16px] w-[11px]"
                                />
                                <span className="text-[14px] font-[400] text-white">
                                Official software
                            </span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="hidden sm:flex">
                <span
                    className={`text-[20px] font-semibold text-[#00A1B3]`}
                >
                    {price}
                </span>
                </div>
            </div>

            <div className={'flex sm:hidden items-center gap-2'}>
                <img
                    src={circle}
                    alt="check"
                    className="h-[16px] w-[16px]"
                />
                <span className={'text-[14px] font-normal text-[#333333]'}>
                        This software is designed to work with any site
                    </span>
            </div>

            <div className={'flex-shrink-0 hidden sm:block'}>
                <p className="text-sm font-normal text-[#5B6A7D] leading-relaxed">{description}</p>
            </div>

            <div className="flex sm:hidden items-center gap-3">
                <div
                    className="flex items-center justify-center gap-1 w-[60px] h-[24px] rounded-[12px] bg-[#E1EAF6]">
                    <span className="text-[14px] font-[600] text-[#333333]">{rating}</span>
                    <img
                        src={star}
                        alt="star"
                        className="h-[14px] w-[14px]"
                    />
                </div>

                <div>
                    <span className="text-[14px] font-[400] text-[#5B6A7D]">{reviews} Reviews</span>
                </div>

                <div className="ml-auto">
                <span
                    className={`text-[20px] font-semibold text-[#00A1B3]`}
                >
                    {price}
                </span>
                </div>
            </div>
        </div>
    );
};

export default SoftwareCard;