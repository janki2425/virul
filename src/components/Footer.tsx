// import React from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faFacebookF,
//   faTwitter,
//   faInstagram,
// } from "@fortawesome/free-brands-svg-icons";

// const Footer = () => {
//   return (
//     <div className="mt-20 border border-[#e9ecef] bg-[#f8f9fa] w-full h-fit">
//       <div className="max-w-[1280px] flex flex-col w-full pt-10 px-5">
//         <div className="flex flex-col lg:grid lg:grid-cols-2">
//           <div className="text-[#868e96] text-[12px] flex flex-col">
//             <Link href="/" className="mb-[20px]">
//               <Image src="/virul-logo.svg" width={70} height={70} alt="virul" />
//             </Link>

//             <p className="my-[12px] lg:my-0 lg:mt-[8px]">
//               Virul is a global self-service ticketing platform for live
//               experiences that allows anyone to book, share, find and attend
//               events that fuel their passions and enrich their lives.
//             </p>

//             <p className="mt-[12px]">
//               From music festivals, marathons, conferences, community rallies,
//               and fundraisers, to gaming competitions and air guitar contests.
//               Our mission is to bring the world together through live
//               experiences.
//             </p>
//           </div>
//           <div className="mt-8 lg:mt-0 lg:pl-5 flex flex-col md:flex-row gap-1.5 md:gap-0 lg:items-start">
//             <div className="flex flex-col gap-2.5">
//               <h3 className="text-black text-[20px] font-[700]">About</h3>
//               <div className="flex flex-col gap-2 text-[#EC248F] text-[14px]">
//                 <p>Features</p>
//                 <p className="max-w-[160px] lg::max-w-full">
//                   Do not sell my personal information
//                 </p>
//                 <p>Terms of use</p>
//               </div>
//             </div>
//             <div className="flex flex-col gap-2.5 md:mr-19">
//               <h3 className="text-black text-[20px] font-[700]">Project</h3>
//               <div className="flex flex-col gap-2 text-[#EC248F] text-[14px]">
//                 <p className="">Contribute</p>
//                 <p>Media assets</p>
//                 <p>Changelog</p>
//                 <p>Releases</p>
//               </div>
//             </div>
//             <div className="flex flex-col gap-2.5">
//               <h3 className="text-black text-[20px] font-[700]">Support</h3>
//               <div className="flex flex-col gap-2 text-[#EC248F] text-[14px]">
//                 <p className="">FAQ's</p>
//                 <p>Terms</p>
//                 <p>Privacy</p>
//                 <p>Help</p>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="flex flex-col lg:flex-row text-center gap-5 pr-2 lg:gap-0 lg:justify-between mt-12 mb-6">
//           <p className="text-[#868e96] text-[14px]">
//             &copy; 2025 Virul All rights reserved.
//           </p>
//           <div className="flex gap-5 items-center justify-center text-[#495057]">
//             <a href="https://twitter.com" target="_blank">
//               <FontAwesomeIcon icon={faTwitter} />
//             </a>
//             <a href="https://facebook.com" target="_blank">
//               <FontAwesomeIcon icon={faFacebookF} />
//             </a>
//             <a href="https://instagram.com" target="_blank">
//               <FontAwesomeIcon icon={faInstagram} />
//             </a>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Footer;


import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF, faTwitter, faInstagram } from "@fortawesome/free-brands-svg-icons";

const sections = [
  {
    title: "About",
    links: ["Features", "Do not sell my personal information", "Terms of use"],
  },
  {
    title: "Project",
    links: ["Contribute", "Media assets", "Changelog", "Releases"],
  },
  {
    title: "Support",
    links: ["FAQ's", "Terms", "Privacy", "Help"],
  },
];

const Footer = () => {
  return (
    <footer className="mt-20 border pb-8 border-[#e9ecef] bg-[#f8f9fa] w-full">
      <div className="max-w-[1280px] w-full pt-10 px-5 mx-auto">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 xl:gap-[300px]">
          {/* Left Section */}
          <div className="text-[#868e96] text-[12px] flex flex-col">
            <Link href="/" className="mb-5">
              <Image src="/virul-logo.svg" width={70} height={70} alt="virul" />
            </Link>
            <p className="mb-2">
              Virul is a global self-service ticketing platform for live experiences that allows
              anyone to book, share, find and attend events that fuel their passions and enrich
              their lives.
            </p>
            <p>
              From music festivals, marathons, conferences, community rallies, and fundraisers, to
              gaming competitions and air guitar contests. Our mission is to bring the world
              together through live experiences.
            </p>
          </div>

          {/* Right Sections */}
          <div className="flex flex-col md:flex-row gap-6">
            {sections.map((sec, idx) => (
              <div key={idx} className="flex flex-col gap-2.5">
                <h3 className="text-black text-[20px] font-bold">{sec.title}</h3>
                <div className="flex flex-col gap-2 max-w-[150px] text-[#EC248F] text-[14px]">
                  {sec.links.map((link, i) => (
                    <p key={i}>{link}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="flex flex-col lg:flex-row text-center gap-5 lg:justify-between mt-8">
          <p className="text-[#868e96] text-[14px]">
            &copy; 2025 Virul. All rights reserved.
          </p>
          <div className="flex gap-5 items-center justify-center text-[#495057] text-[18px]">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faTwitter} className="hover:text-[#1DA1F2]" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faFacebookF} className="hover:text-[#1877F2]" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faInstagram} className="hover:text-[#E1306C]" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
