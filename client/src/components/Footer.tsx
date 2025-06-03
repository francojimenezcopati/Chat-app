const Footer = () => {
    return (
        <footer className='fixed left-4 bottom-4 text-left bg-black/70 px-6 py-2 rounded-full opacity-95 backdrop-blur-sm flex items-center'>
            <div className="bg-[#0077b5] w-[30px] h-[30px] flex items-center justify-center rounded-[4px] mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 448 512" className="fill-white">
                    <path d="M100.28 448H7.4V148.9h92.88zm-46.44-341C24.1 107 0 82.9 0 53.9 0 24.3 24.4 0 53.8 0c29.6 0 53.8 24.3 53.8 53.9 0 29.6-24.2 53.9-53.8 53.9zM447.9 448h-92.4V302.4c0-34.7-.7-79.3-48.4-79.3-48.4 0-55.8 37.8-55.8 76.9V448h-92.4V148.9h88.7v40.8h1.3c12.4-23.4 42.7-48.1 87.9-48.1 94 0 111.3 61.9 111.3 142.3V448z" />
                </svg>
            </div>
            <span className='text-sm text-[#00ccff] opacity-80'>@francojimenezcopati</span>
        </footer>
    );
};

export default Footer;
