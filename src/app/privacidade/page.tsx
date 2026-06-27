import { LegalPage } from "@/components/legal/LegalPage";

export const metadata = {
  title: "Política de privacidade | Rota Potiguar",
  description: "Política de privacidade da plataforma Rota Potiguar",
};

export default function PrivacidadePage() {
  return (
    <LegalPage
      title="Política de privacidade"
      subtitle="Como tratamos seus dados na Rota Potiguar"
      updatedAt="26 de junho de 2026"
      sections={[
        {
          title: "1. Introdução",
          paragraphs: [
            "Esta Política de Privacidade descreve como a Rota Potiguar coleta, utiliza, armazena e protege dados pessoais dos usuários da plataforma, em conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018).",
            "Ao utilizar nossos serviços, você declara estar ciente das práticas descritas neste documento.",
          ],
        },
        {
          title: "2. Dados que coletamos",
          paragraphs: [
            "No cadastro e uso da conta, podemos coletar nome, e-mail, senha (armazenada de forma criptografada), tipo de perfil (Turista, Gestor ou Administrador) e registros de atividade na plataforma.",
            "Também coletamos conteúdos enviados por você, como sinalizações, elogios e locais cadastrados, quando aplicável ao seu perfil.",
            "Informações técnicas como data e hora de acesso, identificadores de sessão e dados de navegação podem ser registradas para segurança e melhoria do serviço.",
          ],
        },
        {
          title: "3. Finalidade do tratamento",
          paragraphs: [
            "Utilizamos seus dados para autenticação, personalização da experiência, exibição de conteúdo por perfil, operação das funcionalidades de locais e categorias, comunicação sobre a conta e cumprimento de obrigações legais.",
            "Dados de sinalizações e elogios são tratados para aprimorar a qualidade das informações turísticas e apoiar a gestão de conteúdo.",
          ],
        },
        {
          title: "4. Base legal",
          paragraphs: [
            "O tratamento de dados pessoais fundamenta-se, conforme o caso, no consentimento do titular, na execução de contrato ou de procedimentos preliminares, no legítimo interesse da plataforma e no cumprimento de obrigação legal ou regulatória.",
          ],
        },
        {
          title: "5. Compartilhamento",
          paragraphs: [
            "Não vendemos seus dados pessoais. O compartilhamento pode ocorrer com provedores de infraestrutura necessários à operação do serviço (como hospedagem e banco de dados), sempre com medidas de segurança adequadas.",
            "Informações públicas de locais cadastrados podem ser exibidas a todos os usuários da plataforma. Sinalizações podem ser associadas ao nome do autor conforme as regras de exibição do sistema.",
            "Dados poderão ser compartilhados com autoridades quando exigido por lei ou ordem judicial.",
          ],
        },
        {
          title: "6. Armazenamento e segurança",
          paragraphs: [
            "Adotamos medidas técnicas e organizacionais para proteger os dados contra acesso não autorizado, perda, alteração ou divulgação indevida.",
            "Os dados são mantidos pelo tempo necessário para cumprir as finalidades descritas nesta política ou conforme exigido por lei.",
          ],
        },
        {
          title: "7. Seus direitos",
          paragraphs: [
            "Nos termos da LGPD, você pode solicitar confirmação de tratamento, acesso, correção, anonimização, portabilidade, eliminação de dados tratados com consentimento, informação sobre compartilhamentos e revogação do consentimento, quando aplicável.",
            "Para exercer seus direitos, utilize os canais oficiais de contato da Rota Potiguar. Responderemos dentro dos prazos legais.",
          ],
        },
        {
          title: "8. Cookies e tecnologias similares",
          paragraphs: [
            "Podemos utilizar cookies e armazenamento local para manter sua sessão autenticada e melhorar a experiência de uso. Você pode gerenciar cookies nas configurações do seu navegador, ciente de que algumas funcionalidades podem ser afetadas.",
          ],
        },
        {
          title: "9. Menores de idade",
          paragraphs: [
            "A plataforma não é direcionada a menores de 18 anos. O cadastro de menores deve ocorrer com supervisão e consentimento do responsável legal, quando permitido pela legislação aplicável.",
          ],
        },
        {
          title: "10. Alterações",
          paragraphs: [
            "Esta política pode ser atualizada para refletir mudanças legais ou operacionais. A data da última revisão será indicada no topo desta página.",
          ],
        },
        {
          title: "11. Contato",
          paragraphs: [
            "Para questões sobre privacidade e proteção de dados, entre em contato pelos canais oficiais da Rota Potiguar.",
          ],
        },
      ]}
    />
  );
}
