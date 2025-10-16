import { KeycloakTokenParsed } from 'keycloak-js';
import { Typography, AccordionDetails, AccordionSummary, Avatar } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { formatDate } from '5_entites';
import { CommentsObjectModel, useTranslate } from '6_shared';
import * as SC from './CommentsAccordion.styled';

interface IProps {
  commentsData: CommentsObjectModel | undefined;
  user: KeycloakTokenParsed | undefined;
}

export const CommentsAccordion = ({ commentsData, user }: IProps) => {
  const translate = useTranslate();
  return (
    <SC.CommentsAccordionStyled>
      {commentsData &&
        commentsData.comments.map(({ id, author, text, created }) => (
          <SC.AccordionStyled key={id}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Avatar sx={{ marginRight: '10px' }} src={user?.picture} alt={user?.name} />
              <SC.CommentsAccordionContent>
                <Typography>{author || translate('No author')}</Typography>
                <SC.CommentsDate>{formatDate(created)}</SC.CommentsDate>

                <SC.CommentsTextSmall>{text}</SC.CommentsTextSmall>
              </SC.CommentsAccordionContent>
            </AccordionSummary>

            <AccordionDetails>
              <Typography sx={{ paddingLeft: '50px' }}>{text}</Typography>
            </AccordionDetails>
          </SC.AccordionStyled>
        ))}
    </SC.CommentsAccordionStyled>
  );
};
