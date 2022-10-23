import React from 'react'
import { AccordionBody, AccordionHeader, AccordionItem, UncontrolledAccordion } from 'reactstrap'
import Categories from '../components/Categories'
import PostWidget from '../components/PostWidget'

function policy() {
    return (
        <div className='container m-auto p-2 mb-4 mt-4'>
        <div className='row'>
            <div className='col-md-8'>
            
                <h1 style={{fontWeight : "bold", textAlign : 'center'}}>Politique de confidentialité</h1>
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
            Politique de confidentialité pour https://maths-exams.com
            </AccordionHeader>
            <AccordionBody accordionId='1'>
            Si vous avez besoin de plus amples renseignements ou si vous avez des questions sur notre politique de confidentialité, n’hésitez pas à communiquer avec nous par courriel à ennaouri.mohammed@gmail.com.
            </AccordionBody>
        </AccordionItem>
        <AccordionItem >
            <AccordionHeader targetId='1'>
            Fichiers journaux
            </AccordionHeader>
            <AccordionBody accordionId='1'>
            Comme beaucoup d’autres sites Web, https://maths-exams.com utilise des fichiers journaux. Les informations contenues dans les fichiers journaux comprennent les adresses de protocole Internet (IP), le type de navigateur, le fournisseur de services Internet (FAI), la date/l’heure, les pages de référence/sortie et le nombre de clics pour analyser les tendances, administrer le site, suivre les déplacements des utilisateurs sur le site, et recueillir des renseignements démographiques. Les adresses IP et autres informations de ce type ne sont liées à aucune information personnellement identifiable. 
        </AccordionBody>
        </AccordionItem>
        <AccordionItem >
            <AccordionHeader targetId='1'>
            Cookies et balises Web 
            </AccordionHeader>
            <AccordionBody accordionId='1'>
            https://maths-exams.com utilise des cookies pour stocker des informations sur les préférences des visiteurs, enregistrer des informations spécifiques à l’utilisateur sur quelles pages l’utilisateur accède ou visite, personnaliser le contenu de la page Web en fonction du type de navigateur des visiteurs ou d’autres informations que le visiteur envoie via son navigateur. 
        </AccordionBody>
        </AccordionItem>
        <AccordionItem >
            <AccordionHeader targetId='1'>
            Double Click DART Cookie 
            </AccordionHeader>
            <AccordionBody accordionId='1'>
            <p>Google, en tant que fournisseur tiers, utilise des témoins pour diffuser des annonces sur https://maths-exams.com.</p>



<p>L’utilisation par Google du témoin DART lui permet de diffuser des publicités aux utilisateurs en fonction de leur visite à https://maths-exams.com et à d’autres sites Internet.</p>


<p>Les utilisateurs peuvent refuser d’utiliser le témoin de l’EICC en consultant la politique de confidentialité du réseau publicitaire et du contenu de Google à l’adresse suivante : http://www.google.com/privacy_ads.html</p>



<p>Certains de nos partenaires publicitaires peuvent utiliser des cookies et des balises web sur notre site. Nos partenaires publicitaires incluent Google Adsense.</p>



<p>Ces serveurs publicitaires tiers ou réseaux publicitaires utilisent la technologie pour les publicités et les liens qui apparaissent sur https://maths-exams.com et les envoient directement à votre navigateur. Ils reçoivent automatiquement votre adresse IP lorsque cela se produit. D’autres technologies (comme les cookies, JavaScript ou les balises Web) peuvent également être utilisées par les réseaux publicitaires tiers pour mesurer l’efficacité de leurs publicités ou pour personnaliser le contenu publicitaire que vous voyez.</p>



<p>https://maths-exams.com n’a aucun accès ni contrôle sur ces cookies utilisés par des annonceurs tiers.</p>



<p>Vous devriez consulter les politiques de confidentialité respectives de ces serveurs publicitaires tiers pour obtenir des informations plus détaillées sur leurs pratiques ainsi que des instructions sur la façon de refuser certaines pratiques.</p>


<p>La politique de confidentialité de https://maths-exams.com ne s’applique pas et nous ne pouvons pas contrôler les activités de ces autres annonceurs ou sites Web.</p>



<p>Si vous souhaitez désactiver les cookies, vous pouvez le faire via les options de votre navigateur. Des informations plus détaillées sur la gestion des cookies avec des navigateurs Web spécifiques sont disponibles sur les sites Web respectifs des navigateurs.</p>
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

export default policy