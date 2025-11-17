import WorkSection from './WorkSection';

// Image assets - local files
const imgTurikunzaWork = "/assets/turikunza-work.png";

export default function TurikunzaWorkSection() {
  return (
    <WorkSection
      id="turikunza"
      title="Turikunza"
      badges={["Product Design", "Design Direction", "Scale-up"]}
      imageSrc={imgTurikunzaWork}
      imageAlt="Turikunza dashboard interface showing tourism management platform"
      year="2023"
      firstParagraph="Turikunza.travel es una plataforma SaaS que empodera a operadores de turismo local para gestionar y hacer crecer sus negocios. Este proyecto nació para resolver un problema real: una empresa de turismo indígena de San Pedro de Atacama necesitaba digitalizar sus operaciones manuales y mejorar la coordinación con sus agencias asociadas."
      secondParagraph={
        <>
          Diseñé y desarrollé junto a su equipo una solución a medida que automatiza las reservas B2B y centraliza la gestión de experiencias, agencias y métricas.
          <br aria-hidden="true" />
          Lo que comenzó como un MVP personalizado evolucionó hacia una plataforma SaaS multi-tenant, capaz de conectar a distintas comunidades, promover la sostenibilidad y preservar el valor cultural del territorio.
        </>
      }
    />
  );
}

