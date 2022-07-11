import Link from "next/link";
import {Card, CardImg, CardBody, CardTitle, CardSubtitle, CardText, Button} from "reactstrap"
const PostCard = ({post}) => {
    return ( 
        <Card>
        <CardImg
          alt={post.title}
          src={post.thumbnail.url}
          top
          width="100%"
          height={315}
          className="p-3"
        />
        <CardBody>
          <CardTitle tag="h5">
            Correction examen national Mathématiques 2022 | section PC et SVT session juin
          </CardTitle>
          <CardSubtitle
            className="mb-2 text-muted"
            tag="h6"
          >
            Solution Video
          </CardSubtitle>
          <CardText>
          Je vous présente ici une solution de l exercice 1 concernant la géométrie dans l'espace de l'examen national 2022 (section PC et SVT session juin). 
Calcule du produit vectoriel de deux vecteurs
ecrire l'equation cartésienne d'un plan
calculer la distance d'un point à un plan.
trouver l'equation d'une sphere.
montrer q'un plan est tangent à une sphere.
trouver la repéresentation paramétrique d'une droite.
montrer d'une droite est tangente à une sphere.
trouver la distance d'un point à une droite
          </CardText>
          <Link href={`/posts/${post.slug}`}>
          <Button color="primary" size="lg" block>Consulter</Button>
          </Link>
        </CardBody>
      </Card>
     );
}
 
export default PostCard;