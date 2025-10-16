import { InputWithIcon, useObjectCRUD, useTranslate } from '6_shared';
import * as SC from './CommentsInput.styled';

interface IProps {
  handleAddComment: () => Promise<void>;
  setComment: React.Dispatch<React.SetStateAction<string>>;
  comment: string;
}

export const CommentsInput = ({ handleAddComment, setComment, comment }: IProps) => {
  const translate = useTranslate();

  const { setIsObjectCRUDModalOpen } = useObjectCRUD();

  return (
    <SC.CommentInputStyled>
      <SC.Body>
        <InputWithIcon
          widthPercent
          placeHolderText={translate('Comment')}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </SC.Body>

      <SC.Footer>
        <SC.ButtonStyled variant="outlined" onClick={() => setIsObjectCRUDModalOpen(false)}>
          {translate('Cancel')}
        </SC.ButtonStyled>
        <SC.ButtonStyled variant="contained" onClick={handleAddComment}>
          {translate('Comment')}
        </SC.ButtonStyled>
      </SC.Footer>
    </SC.CommentInputStyled>
  );
};
