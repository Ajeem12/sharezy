import React from "react";
import {
  MdInfoOutline,
  MdVerifiedUser,
  MdAssignmentTurnedIn,
  MdBlock,
  MdReportProblem,
  MdUpdate,
  MdContactMail,
} from "react-icons/md";

const termsSections = [
  {
    icon: <MdInfoOutline size={32} className="text-blue-500" />,
    title: "Introduction",
    content:
      "Welcome to Sharezy. By using our services, you agree to comply with and be bound by these terms and conditions.",
  },
  {
    icon: <MdVerifiedUser size={32} className="text-green-500" />,
    title: "Eligibility",
    content:
      "You must be at least 18 years old to publish a ride. By using Sharezy, you confirm that you meet this age requirement.",
  },
  {
    icon: <MdAssignmentTurnedIn size={32} className="text-purple-500" />,
    title: "User Responsibilities",
    list: [
      "Provide accurate and truthful ride information.",
      "Ensure passenger safety and follow traffic laws.",
      "Resolve disputes directly and respectfully.",
    ],
  },
  {
    icon: <MdBlock size={32} className="text-red-500" />,
    title: "Prohibited Activities",
    content:
      "No illegal activities, discrimination, harassment, or harmful conduct are allowed on Sharezy.",
  },
  {
    icon: <MdReportProblem size={32} className="text-yellow-500" />,
    title: "Limitation of Liability",
    content:
      "Sharezy is not responsible for loss, damage, or injury from using the platform or arranged rides.",
  },
  {
    icon: <MdUpdate size={32} className="text-blue-700" />,
    title: "Changes to Terms",
    content:
      "We may update these terms anytime. Continued use means acceptance of changes.",
  },
  {
    icon: <MdContactMail size={32} className="text-pink-500" />,
    title: "Contact Us",
    content: (
      <>
        Questions? Contact us at{" "}
        <a
          href="mailto:support@sharezy.com"
          className="text-blue-600 font-semibold underline hover:text-blue-800 transition"
        >
          support@sharezy.com
        </a>
        .
      </>
    ),
  },
];

const TermsAndConditionsPage = () => {
  return (
    <main className="min-h-screen py6 px-6 flex justify-center">
      <div className="max-w-7xl w-full">
        <h1 className="text-4xl font-extrabold text-center text-blue-500 mb-12 drop-shadow-md">
          Sharezy Terms and Conditions
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {termsSections.map(({ icon, title, content, list }, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-5 shadow-md hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 flex flex-col"
            >
              <div className="mb-4 flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mx-auto">
                {icon}
              </div>
              <h2 className="text-xl font-semibold text-blue-500 mb-2 text-center">
                {title}
              </h2>
              {list ? (
                <ul className="list-disc list-inside text-gray-700 space-y-1 px-1 text-sm">
                  {list.map((item, i) => (
                    <li key={i} className="leading-snug">
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-700 leading-snug px-1 text-sm">{content}</p>
              )}
            </div>
          ))}
        </div>

        
      </div>
    </main>
  );
};

export default TermsAndConditionsPage;
