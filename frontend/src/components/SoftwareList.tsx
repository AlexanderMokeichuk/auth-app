import React from 'react';
import SoftwareCard from './SoftwareCard';
import logo from "@/assets/logo.svg"
import group49 from "@/assets/Group49.svg"
import group50 from "@/assets/Group50.svg"


interface SoftwareItem {
    id: string;
    icon: string;
    title: string;
    description: string;
    rating: number;
    reviews: number;
    price: string;
    isOfficial: boolean;
}

const softwareData: SoftwareItem[] = [
    {
        id: '1',
        icon: group49,
        title: '2Captcha solver',
        description: 'Extension for the Google Chrome browser that automatically recognizes captchas such as ReCaptcha V2, V3, GeeTest, Arkose Labs FunCaptcha, Human Captcha and others.',
        rating: 4.6,
        reviews: 456,
        price: 'Free',
        isOfficial: true
    },
    {
        id: '2',
        icon: logo,
        title: 'Puppeteer plugin to solve reCAPTCHAs automatically',
        description: 'Solves reCAPTCHAs automatically, using a single line of code.',
        rating: 4.6,
        reviews: 456,
        price: '$67',
        isOfficial: false
    },
    {
        id: '3',
        icon: group50,
        title: '2captcha-javascript',
        description: 'JavaScript npm package for easy integration with the API of 2captcha captcha solving service to bypass recaptcha, funcaptcha, geetest and solve any other captchas.',
        rating: 4.6,
        reviews: 456,
        price: 'Free',
        isOfficial: false
    }
];

const SoftwareList: React.FC = () => {
    return (
        <div className="space-y-4 flex flex-col items-center">
            {softwareData.map((software) => (
                <SoftwareCard
                    key={software.id}
                    icon={software.icon}
                    title={software.title}
                    description={software.description}
                    rating={software.rating}
                    reviews={software.reviews}
                    price={software.price}
                    isOfficial={software.isOfficial}
                />
            ))}
        </div>
    );
};

export default SoftwareList;