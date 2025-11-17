import React from 'react';
import WorkSection from './WorkSection';

// Image assets - local files (placeholder - reemplazar con la imagen real)
const imgWork2 = "/assets/work-2.png";

export default function WorkSection2() {
  return (
    <WorkSection
      id="work-2"
      title="Nuevo Proyecto"
      badges={["Product Design", "Frontend Development"]}
      imageSrc={imgWork2}
      imageAlt="Screenshot del nuevo proyecto"
      year="2024"
      firstParagraph="Descripción del primer párrafo del nuevo proyecto. Aquí puedes agregar información sobre el proyecto, su propósito y los problemas que resuelve."
      secondParagraph={
        <>
          Descripción del segundo párrafo del nuevo proyecto. Aquí puedes agregar más detalles sobre el proceso de diseño, desarrollo o implementación.
          <br aria-hidden="true" />
          Información adicional sobre el proyecto y sus resultados.
        </>
      }
    />
  );
}

