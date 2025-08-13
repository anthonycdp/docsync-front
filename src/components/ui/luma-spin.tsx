import React, { useEffect, useState } from "react";

const messages = [
  "Lançando o arquivo...",
  "Pintando seu template...",
  "Caçando informações...",
  "Polindo os detalhes...",
  "Vestindo o documento...",
  "Quase lá, guerreiro!",
  "Arquivo pronto!"
];

export const LumaSpin: React.FC = () => {
  const [currentMessage, setCurrentMessage] = useState(messages[0]);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % messages.length;
      setCurrentMessage(messages[index]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-[65px] aspect-square">
        <span className="absolute rounded-[50px] animate-luma-spin shadow-[inset_0_0_0_3px] shadow-gray-800 dark:shadow-gray-100" />
        <span className="absolute rounded-[50px] animate-luma-spin-delay shadow-[inset_0_0_0_3px] shadow-gray-800 dark:shadow-gray-100" />
      </div>
      <span className="text-sm text-center font-medium text-gray-700 dark:text-gray-300">
        {currentMessage}
      </span>
    </div>
  );
};

export default LumaSpin;