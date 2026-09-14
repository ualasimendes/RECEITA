import React, { useState } from 'react';
import { FilePlus, ShieldCheck, ChevronRight, KeyRound, Lock, Eye, EyeOff, X, AlertCircle } from 'lucide-react';

interface WelcomeStepProps {
  onStart: () => void;
  onLoadTestPrescription: () => void;
}

// Imagem profissional de alta definição: médico prescrevendo receita no balcão sem marcas ou merchandising
const HERO_IMAGE_URL =
  'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=2000&q=85';

const TEST_PASSWORD = '199588';

export const WelcomeStep: React.FC<WelcomeStepProps> = ({ onStart, onLoadTestPrescription }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleOpenModal = () => {
    setPassword('');
    setHasError(false);
    setShowPassword(false);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setPassword('');
    setHasError(false);
  };

  const handleSubmitPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim() === TEST_PASSWORD) {
      setIsModalOpen(false);
      setPassword('');
      setHasError(false);
      onLoadTestPrescription();
    } else {
      setHasError(true);
      setPassword('');
    }
  };

  return (
    <div
      id="step-welcome"
      className="relative w-full min-h-screen flex flex-col justify-between overflow-hidden bg-slate-950 text-white"
    >
      {/* 1. IMAGEM DESTAQUE TOTAL (Médico prescrevendo receita no balcão, sem marcas, sem merchandising) */}
      <div className="absolute inset-0 z-0">
        <img
          src={HERO_IMAGE_URL}
          alt="Médico prescrevendo receita médica no balcão"
          className="w-full h-full object-cover object-[center_35%] filter brightness-[0.88] contrast-[1.05]"
          referrerPolicy="no-referrer"
        />
        {/* Degradê ótico cinematográfico */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-slate-950/30" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-transparent to-slate-950/85" />
      </div>

      {/* Topo: Marca clean e discreta */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-sky-500/90 backdrop-blur-md flex items-center justify-center text-white shadow-md border border-white/20">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="font-black text-base sm:text-lg tracking-tight text-white drop-shadow-md">
              Receita
            </span>
            <span className="text-[10px] text-sky-200 block font-medium leading-none">
              Prescrição Médica Digital
            </span>
          </div>
        </div>
      </div>

      {/* 2. CENTRO E PARTE PRINCIPAL: TÍTULO COM FONTE GRANDE E BOTÃO "GERAR RECEITA" */}
      <div className="relative z-10 w-full max-w-2xl mx-auto px-4 sm:px-6 pb-10 pt-12 sm:pt-24 flex flex-col items-center text-center">
        {/* Título com fonte ampliada e visual clean */}
        <div className="mb-8 sm:mb-12">
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-white drop-shadow-2xl leading-none">
            Prescrição Médica
          </h1>
        </div>

        {/* BOTÃO EM EVIDÊNCIA ABSOLUTA: GERAR RECEITA */}
        <div className="w-full sm:w-auto flex flex-col items-center gap-3">
          <button
            id="btn-start-prescription-hero"
            type="button"
            onClick={onStart}
            className="group relative w-full sm:w-auto sm:min-w-[380px] px-8 py-4 sm:py-5 bg-gradient-to-r from-sky-500 via-sky-600 to-blue-600 hover:from-sky-400 hover:via-sky-500 hover:to-blue-500 active:scale-[0.98] text-white font-black text-lg sm:text-xl rounded-2xl shadow-2xl shadow-sky-950/80 flex items-center justify-center gap-3.5 transition-all duration-200 cursor-pointer border border-sky-300/40 ring-4 ring-sky-500/20"
          >
            <FilePlus className="w-7 h-7 shrink-0 transition-transform group-hover:scale-110" />
            <span className="tracking-wider uppercase">GERAR RECEITA</span>
            <ChevronRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
          </button>

          {/* Botão Secundário: Gerar Receita Teste */}
          <button
            type="button"
            onClick={handleOpenModal}
            id="btn-start-test-prescription"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold text-slate-200 hover:text-white bg-slate-900/60 hover:bg-slate-900/80 backdrop-blur-md border border-white/20 rounded-xl transition-all cursor-pointer shadow-lg active:scale-95"
          >
            <KeyRound className="w-4 h-4 text-sky-400" />
            <span>Gerar receita teste (modo de teste)</span>
          </button>
        </div>
      </div>

      {/* 3. RODAPÉ BEM DISCRETO */}
      <div className="relative z-10 w-full py-2.5 px-4 text-center border-t border-white/10 bg-slate-950/85 backdrop-blur-md">
        <p className="text-[10px] text-slate-400">
          A ferramenta apenas auxilia na digitação do documento • Conteúdo de responsabilidade exclusiva do médico prescritor
        </p>
      </div>

      {/* MODAL DE SENHA PARA GERAR RECEITA TESTE */}
      {isModalOpen && (
        <div
          id="modal-test-password-backdrop"
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={handleCloseModal}
        >
          <div
            id="modal-test-password-card"
            className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 text-white relative animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botão Fechar */}
            <button
              type="button"
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors cursor-pointer p-1"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Cabeçalho do Modal */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400 shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">Receita de Teste</h3>
                <p className="text-xs text-slate-400">Preenchimento automático com dados fictícios</p>
              </div>
            </div>

            {/* Formulário */}
            <form onSubmit={handleSubmitPassword} className="space-y-4">
              <div>
                <label
                  htmlFor="test-password-input"
                  className="block text-xs font-semibold text-slate-300 mb-1.5"
                >
                  Digite a senha de teste:
                </label>
                <div className="relative">
                  <input
                    id="test-password-input"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (hasError) setHasError(false);
                    }}
                    autoFocus
                    autoComplete="off"
                    placeholder="Digite a senha..."
                    className={`w-full py-2.5 pl-3.5 pr-10 bg-slate-800/90 border ${
                      hasError ? 'border-rose-500 focus:ring-rose-500/40' : 'border-slate-600 focus:border-sky-500 focus:ring-sky-500/30'
                    } rounded-xl text-white placeholder:text-slate-500 text-sm tracking-widest focus:outline-none focus:ring-2 transition-all font-mono`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-1 cursor-pointer"
                    tabIndex={-1}
                    title={showPassword ? 'Esconder senha' : 'Ver senha'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {hasError && (
                  <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>Senha incorreta. Tente novamente.</span>
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  id="btn-submit-test-password"
                  className="flex-1 py-2.5 px-3 bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-md shadow-sky-900/40"
                >
                  Acessar Teste
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
