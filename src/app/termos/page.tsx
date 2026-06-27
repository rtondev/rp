import { LegalPage } from "@/components/legal/LegalPage";

export const metadata = {
  title: "Termos de uso | Rota Potiguar",
  description: "Termos de uso da plataforma Rota Potiguar",
};

export default function TermosPage() {
  return (
    <LegalPage
      title="Termos de uso"
      subtitle="Regras para utilização da Rota Potiguar"
      updatedAt="26 de junho de 2026"
      sections={[
        {
          title: "1. Aceitação",
          paragraphs: [
            "Ao acessar ou utilizar a plataforma Rota Potiguar, você concorda com estes Termos de Uso. Se não concordar com qualquer disposição, não utilize o serviço.",
            "O uso da plataforma implica ciência de que o conteúdo sobre locais e categorias pode ser atualizado, alterado ou removido a qualquer momento.",
          ],
        },
        {
          title: "2. Sobre a plataforma",
          paragraphs: [
            "A Rota Potiguar é uma plataforma de descoberta e gestão de experiências turísticas no Rio Grande do Norte, permitindo consulta de locais, cadastro de conteúdo por gestores e guias, além de sinalizações e elogios enviados por usuários.",
            "As informações exibidas têm caráter informativo. Horários, disponibilidade, preços e condições de acesso devem ser confirmados diretamente com os estabelecimentos ou organizadores responsáveis.",
          ],
        },
        {
          title: "3. Cadastro e perfis",
          paragraphs: [
            "Para utilizar determinadas funcionalidades, é necessário criar uma conta informando dados verdadeiros e atualizados. Você é responsável pela confidencialidade da sua senha e por todas as atividades realizadas em sua conta.",
            "A plataforma oferece perfis de Turista, Gestor e Administrador. Cada perfil possui permissões específicas. O uso indevido de um perfil para fins não autorizados pode resultar em suspensão ou exclusão da conta.",
          ],
        },
        {
          title: "4. Conteúdo e responsabilidades",
          paragraphs: [
            "Gestores e guias são responsáveis pela veracidade das informações publicadas sobre locais, incluindo descrições, imagens, links e disponibilidade.",
            "Turistas e demais usuários devem utilizar as funcionalidades de sinalização e elogio de forma ética, sem conteúdo ofensivo, discriminatório, falso ou que viole direitos de terceiros.",
            "A Rota Potiguar pode moderar, editar ou remover conteúdos que violem estes termos ou a legislação aplicável, sem aviso prévio quando necessário.",
          ],
        },
        {
          title: "5. Conduta proibida",
          paragraphs: [
            "É vedado utilizar a plataforma para práticas ilegais, envio de spam, tentativas de acesso não autorizado, engenharia reversa, coleta automatizada de dados sem permissão ou qualquer ação que comprometa a segurança e o funcionamento do serviço.",
            "Também é proibido se passar por outra pessoa, publicar dados pessoais de terceiros sem consentimento ou utilizar imagens e textos sem os direitos necessários.",
          ],
        },
        {
          title: "6. Propriedade intelectual",
          paragraphs: [
            "A marca, identidade visual, software e estrutura da plataforma pertencem à Rota Potiguar ou a seus licenciadores. O uso não autorizado é proibido.",
            "Conteúdos enviados por usuários permanecem de responsabilidade de quem os publicou, concedendo à plataforma licença não exclusiva para exibição e operação do serviço.",
          ],
        },
        {
          title: "7. Limitação de responsabilidade",
          paragraphs: [
            "A Rota Potiguar não se responsabiliza por danos decorrentes de informações incorretas fornecidas por terceiros, indisponibilidade temporária do serviço, falhas de conexão ou decisões tomadas com base em conteúdo da plataforma.",
            "A relação entre turistas e estabelecimentos ocorre diretamente entre as partes envolvidas.",
          ],
        },
        {
          title: "8. Alterações e encerramento",
          paragraphs: [
            "Estes termos podem ser atualizados periodicamente. Recomendamos a revisão regular desta página.",
            "A conta pode ser encerrada pelo usuário a qualquer momento. A plataforma reserva-se o direito de suspender ou encerrar contas que violem estes termos.",
          ],
        },
        {
          title: "9. Contato",
          paragraphs: [
            "Em caso de dúvidas sobre estes Termos de Uso, entre em contato pelos canais oficiais da Rota Potiguar.",
          ],
        },
      ]}
    />
  );
}
