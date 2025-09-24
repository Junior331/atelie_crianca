"use client";

const Footer = () => {
  return (
    <footer className="bg-[#000000] text-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <p className="text-lg">Criando momentos especiais desde sempre ✨</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <h4 className="font-semibold mb-2 flex items-center justify-center gap-2">
              📞 Contato
            </h4>
            <p className="text-sm text-[#c9c9c9]">WhatsApp: (11) 99999-9999</p>
            <p className="text-sm text-[#c9c9c9]">
              Email: contato@oficinacriancas.com
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-2 flex items-center justify-center gap-2">
              🕐 Horário
            </h4>
            <p className="text-sm text-[#c9c9c9]">Segunda à Sexta: 8h às 18h</p>
            <p className="text-sm text-[#c9c9c9]">Sábados: 9h às 14h</p>
          </div>

          <div>
            <h4 className="font-semibold mb-2 flex items-center justify-center gap-2">
              📍 Atendimento
            </h4>
            <p className="text-sm text-[#c9c9c9]">Rio de Janeiro e região</p>
            <p className="text-sm text-[#c9c9c9]">Eventos personalizados</p>
          </div>
        </div>

        <div className="text-center mt-8 pt-4 border-t border-[#383838]">
          <p className="text-xs text-[#787885]">
            © 2024 ateliê de criança. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export { Footer };
