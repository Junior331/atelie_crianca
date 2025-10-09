"use client";

const Footer = () => {
  return (
    <footer className="bg-[#000000] text-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <p className="text-lg">VEM SER FELIZ COM A GENTE!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <h4 className="font-semibold mb-2 flex items-center justify-center gap-2">
              📞 Contato
            </h4>
            <p className="text-sm text-[#c9c9c9]">WhatsApp: (21) 98253-3717 </p>
            <p className="text-sm text-[#c9c9c9]">
              Email: ateliedecrianca@gmail.com
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2 flex items-center justify-center gap-2">
              🕐 Horário
            </h4>
            <p className="text-sm text-[#c9c9c9]">Segunda a sexta: 8h às 17h</p>
          </div>

          <div>
            <h4 className="font-semibold mb-2 flex items-center justify-center gap-2">
              📍 Atendimento
            </h4>
            <p className="text-sm text-[#c9c9c9]">Rio de Janeiro e Sudeste</p>
            <p className="text-sm text-[#c9c9c9]">Eventos Personalizados</p>
          </div>
        </div>

        <div className="text-center mt-8 pt-4 border-t border-[#383838]">
          <p className="text-xs text-[#787885]">
            © 2024 Ateliê de Criança. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export { Footer };
