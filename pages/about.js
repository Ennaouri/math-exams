import React from 'react'
import { AccordionBody, AccordionHeader, AccordionItem, UncontrolledAccordion } from 'reactstrap'
import Categories from '../components/Categories';
import PostWidget from '../components/PostWidget';
const About = () => {
    return (
        <div className='container m-auto p-2 mb-4 mt-4'>
        <div className='row'>
            <div className='col-md-8'>
            
                <h1 style={{fontWeight : "bold", textAlign : 'center'}}>A propos de nous</h1>
  <UncontrolledAccordion
    defaultOpen={[
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9'
    ]}
    stayOpen
  >
            <AccordionItem >
            <AccordionHeader targetId='1'>
Introduction            
</AccordionHeader>
            <AccordionBody accordionId='1'>
            Les mathématiques est un domaine de connaissance qui comprend l&apos;étude de concepts tels que les nombres, les formes, les quantités et les espaces. Il comprend également des sous-domaines tels que l&apos;arithmétique, l&apos;algèbre, la géométrie, la trigonométrie, la calculatrice, les statistiques et la théorie des nombres. Les mathématiques sont utilisées dans de nombreux domaines tels que la physique, l&apos;ingénierie, l&apos;informatique, l&apos;économie et les sciences sociales pour résoudre des problèmes et comprendre les phénomènes complexes. Les mathématiques sont également considérées comme une science formelle qui utilise des raisonnements logiques et des preuves pour démontrer des théorèmes et des conjectures. Les mathématiques sont enseignées dans les écoles, les collèges et les universités, et il existe de nombreux moyens pour les étudiants d&apos;apprendre et de comprendre les mathématiques, comme les cours en ligne, les livres, les tutoriels vidéo, les exercices interactifs et les jeux éducatifs.

            </AccordionBody>
        </AccordionItem>
        <AccordionItem >
            <AccordionHeader targetId='2'>
Maths-exams la platforms des exams de maths par excellence            </AccordionHeader>
            <AccordionBody accordionId='2'>
            Il existe de nombreux sites et plateformes en ligne qui proposent des examens et des contrôles de mathématiques pour les élèves et les étudiants. Maths exams a pris sa place parmis les plus grandes en ci-peu de temps. Maths-exams est :

<p>une plateforme éducative en ligne qui propose des cours et des exercices de mathématiques pour tous les niveaux, allant de l&apos;école primaire à l&apos;université.</p>
<p>une plateforme qui propose des exercices de mathématiques pour les élèves du collège et du lycée. Il contient également des cours et des vidéos pour aider les utilisateurs à comprendre les concepts mathématiques.</p>
<p>Il est important de noter que ces plateformes ont généralement des fonctionnalités d&apos;évaluation et de suivi pour permettre aux utilisateurs de suivre leur progrès et de cibler les domaines qui nécessitent des améliorations. Il est également important de choisir une plateforme qui est adaptée à votre niveau de compétence en mathématiques et à vos besoins d&apos;apprentissage.</p>
</AccordionBody>
        </AccordionItem>
        <AccordionItem >
            <AccordionHeader targetId='3'>
            Vous aidez à résoudre vos propres exercices
            </AccordionHeader>
            <AccordionBody accordionId='3'>
            Il existe de nombreuses autres applications pour résoudre des exercices de mathématiques qui sont disponibles pour les utilisateurs de smartphones et de tablettes. Il est important de choisir une application qui convient à vos besoins et à votre niveau de compétence en mathématiques.
            <p>Maths exams propose une application qui vous permet de poster vos propres exercice à résoudre. Cette application est disponible seulement sur android
                en attendant son arrivé sur le Appstore. ExerciceResolver permet aux utilisateurs de résoudre des exercices mathématiques en se réferent à un équipe de professeurs expérimentés qui sont prêt à consacrer leurs temps et leurs efforts pour vous aidez en plus des tutoriels vidéo et des exercices interactifs pour aider les utilisateurs à comprendre les concepts mathématiques de base.
            </p>
                    </AccordionBody>
</AccordionItem>
  
  </UncontrolledAccordion>
  </div>
    <div className="col-md-4">
            <div className="relative lg:sticky top-8" style={{marginTop : '56px'}}>
              <PostWidget /* slug={post.slug} categories={post.categories.map((category) => category.slug)}  *//>
              <Categories />
            </div>
          </div>
      
    </div>
    </div>
  )
}

export default About
