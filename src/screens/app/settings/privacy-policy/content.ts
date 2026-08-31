export type PolicyBlock =
  { type: "paragraph"; text: string } | { type: "bullets"; items: string[] };

export interface PolicySubsection {
  title: string;
  blocks: PolicyBlock[];
}

export interface PolicySection {
  number: number;
  title: string;
  subsections: PolicySubsection[];
}

export const privacyPolicySections: PolicySection[] = [
  {
    number: 1,
    title: "Política de Privacidade",
    subsections: [
      {
        title: "1.1. Compromisso com a sua privacidade",
        blocks: [
          {
            type: "paragraph",
            text: "A plataforma Meu e-Gov tem como compromisso garantir a privacidade e a proteção dos dados pessoais de todos os cidadãos, servidores e gestores que utilizam nossos serviços digitais, em conformidade com a Lei nº 13.709/2018 (Lei Geral de Proteção de Dados Pessoais — LGPD).",
          },
        ],
      },
      {
        title: "1.2. Dados coletados",
        blocks: [
          {
            type: "paragraph",
            text: "Durante a utilização do aplicativo, poderemos coletar as seguintes informações:",
          },
          {
            type: "bullets",
            items: [
              "Dados cadastrais: nome completo, CPF, e-mail, telefone e órgão de vinculação;",
              "Dados de autenticação: credenciais de acesso e registros de login;",
              "Dados de uso: páginas acessadas, funcionalidades utilizadas e data e hora dos acessos;",
              "Dados técnicos: modelo do dispositivo, sistema operacional, versão do aplicativo e endereço IP.",
            ],
          },
        ],
      },
      {
        title: "1.3. Finalidade do tratamento",
        blocks: [
          {
            type: "paragraph",
            text: "Os dados pessoais coletados são utilizados exclusivamente para:",
          },
          {
            type: "bullets",
            items: [
              "Permitir o acesso seguro e a identificação do usuário na plataforma;",
              "Disponibilizar informações de receitas, despesas e secretarias municipais;",
              "Enviar notificações e comunicados institucionais autorizados pelo usuário;",
              "Aprimorar a experiência de uso, a estabilidade e a segurança do aplicativo;",
              "Cumprir obrigações legais, regulatórias e de transparência pública.",
            ],
          },
        ],
      },
      {
        title: "1.4. Compartilhamento de dados",
        blocks: [
          {
            type: "paragraph",
            text: "O Meu e-Gov não comercializa dados pessoais. O compartilhamento ocorre apenas com órgãos públicos competentes, prestadores de serviço de tecnologia contratados sob cláusulas de confidencialidade, ou mediante determinação legal ou judicial.",
          },
        ],
      },
      {
        title: "1.5. Armazenamento e segurança",
        blocks: [
          {
            type: "paragraph",
            text: "Os dados são armazenados em ambiente controlado, com uso de criptografia em trânsito e em repouso, controle de acesso por perfil, registro de auditoria e rotinas periódicas de backup. Os dados são mantidos pelo período necessário ao cumprimento das finalidades descritas ou das obrigações legais aplicáveis.",
          },
        ],
      },
      {
        title: "1.6. Direitos do titular",
        blocks: [
          {
            type: "paragraph",
            text: "Nos termos da LGPD, o titular pode a qualquer momento solicitar:",
          },
          {
            type: "bullets",
            items: [
              "Confirmação da existência de tratamento de seus dados;",
              "Acesso, correção, anonimização, bloqueio ou eliminação de dados;",
              "Portabilidade dos dados a outro fornecedor de serviço;",
              "Informação sobre o compartilhamento realizado;",
              "Revogação do consentimento anteriormente concedido.",
            ],
          },
          {
            type: "paragraph",
            text: "As solicitações podem ser feitas pela Central de Ajuda do aplicativo ou pelo canal de contato do Encarregado de Dados (DPO) do município.",
          },
        ],
      },
      {
        title: "1.7. Cookies e tecnologias similares",
        blocks: [
          {
            type: "paragraph",
            text: "Podemos utilizar identificadores locais e tecnologias equivalentes para manter a sessão ativa, lembrar preferências de menu e medir o desempenho do aplicativo. Esses registros não são utilizados para publicidade.",
          },
        ],
      },
    ],
  },
  {
    number: 2,
    title: "Termo de Consentimento para Tratamento de Dados",
    subsections: [
      {
        title: "2.1. Declaração de consentimento",
        blocks: [
          {
            type: "paragraph",
            text: "Ao criar uma conta e utilizar o aplicativo Meu e-Gov, o usuário declara, de forma livre, informada e inequívoca, que consente com o tratamento dos seus dados pessoais nos termos da Lei nº 13.709/2018 e das condições descritas neste documento.",
          },
        ],
      },
      {
        title: "2.2. Dados objeto do consentimento",
        blocks: [
          {
            type: "bullets",
            items: [
              "Dados de identificação pessoal e funcional;",
              "Dados de contato para envio de notificações e comunicados;",
              "Dados de navegação e uso das funcionalidades do aplicativo;",
              "Documentos e certificados enviados voluntariamente pelo usuário.",
            ],
          },
        ],
      },
      {
        title: "2.3. Finalidades autorizadas",
        blocks: [
          {
            type: "paragraph",
            text: "O consentimento abrange o uso dos dados para autenticação, prestação dos serviços digitais, envio de notificações institucionais, geração de estatísticas agregadas e anonimizadas e melhoria contínua da plataforma.",
          },
        ],
      },
      {
        title: "2.4. Prazo e revogação",
        blocks: [
          {
            type: "paragraph",
            text: "O consentimento é válido enquanto durar a relação de uso da plataforma. O usuário pode revogá-lo a qualquer momento, de forma gratuita e simplificada, pela Central de Ajuda. A revogação não invalida os tratamentos realizados anteriormente nem afasta a conservação de dados exigida por obrigação legal.",
          },
        ],
      },
      {
        title: "2.5. Consequências da não concessão",
        blocks: [
          {
            type: "paragraph",
            text: "A ausência ou revogação do consentimento pode impedir o acesso a funcionalidades que dependam de identificação do usuário, permanecendo disponíveis os conteúdos de transparência pública de acesso livre.",
          },
        ],
      },
      {
        title: "2.6. Dados de menores e dados sensíveis",
        blocks: [
          {
            type: "paragraph",
            text: "O aplicativo não tem por finalidade coletar dados pessoais sensíveis nem dados de crianças e adolescentes. Caso identificado esse tipo de registro sem base legal adequada, os dados serão eliminados.",
          },
        ],
      },
    ],
  },
  {
    number: 3,
    title: "Termos de Uso da Plataforma",
    subsections: [
      {
        title: "3.1. Aceitação dos termos",
        blocks: [
          {
            type: "paragraph",
            text: "O uso do aplicativo Meu e-Gov implica a aceitação integral destes Termos de Uso. Se você não concordar com alguma condição, deve interromper a utilização da plataforma.",
          },
        ],
      },
      {
        title: "3.2. Objeto da plataforma",
        blocks: [
          {
            type: "paragraph",
            text: "O Meu e-Gov é um canal digital de transparência e serviços públicos, que disponibiliza informações sobre receitas, despesas, secretarias e comunicados oficiais do município, além de recursos de acompanhamento e notificação.",
          },
        ],
      },
      {
        title: "3.3. Cadastro e responsabilidade do usuário",
        blocks: [
          {
            type: "bullets",
            items: [
              "Fornecer informações verdadeiras, completas e atualizadas;",
              "Manter a confidencialidade das credenciais de acesso;",
              "Comunicar imediatamente qualquer uso não autorizado da conta;",
              "Responder pelos atos praticados com o seu login.",
            ],
          },
        ],
      },
      {
        title: "3.4. Condutas vedadas",
        blocks: [
          {
            type: "bullets",
            items: [
              "Utilizar a plataforma para fins ilícitos ou contrários à ordem pública;",
              "Tentar obter acesso não autorizado a sistemas, dados ou contas de terceiros;",
              "Inserir códigos maliciosos ou realizar ações que comprometam a disponibilidade do serviço;",
              "Reproduzir, alterar ou distribuir conteúdos da plataforma sem autorização.",
            ],
          },
        ],
      },
      {
        title: "3.5. Disponibilidade do serviço",
        blocks: [
          {
            type: "paragraph",
            text: "O serviço é oferecido em regime de melhor esforço, podendo sofrer interrupções para manutenção programada, atualização de versões ou por motivos técnicos alheios à administração pública.",
          },
        ],
      },
      {
        title: "3.6. Propriedade intelectual",
        blocks: [
          {
            type: "paragraph",
            text: "A marca, nome, layout, ícones, os textos e o código-fonte do Meu e-Gov são protegidos por lei. Os dados abertos de transparência podem ser reutilizados, mediante citação da fonte.",
          },
        ],
      },
      {
        title: "3.7. Foro e legislação aplicável",
        blocks: [
          {
            type: "paragraph",
            text: "Aplica-se a legislação brasileira, ficando eleito o foro da comarca do município responsável pela plataforma para dirimir eventuais controvérsias.",
          },
        ],
      },
    ],
  },
];
