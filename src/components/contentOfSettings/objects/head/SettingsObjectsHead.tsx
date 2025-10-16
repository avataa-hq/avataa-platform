// import { useEffect, useState } from 'react';
import { Add, Info, Search } from '@mui/icons-material';
import { Box, Button } from '@mui/material';
// import { StyledInputBase } from 'components/contentOfSettings/objects/SearchStyles';
import { ActionTypes, useSettingsObject } from '6_shared';
// import SearchObjectsStyles from './SearchObjectsStyles';
import SettingsObjectsHeadStyled from './SettingsObjectsHead.styled';

const SettingsObjectsHead = ({ permissions }: { permissions?: Record<ActionTypes, boolean> }) => {
  const { objType, setIsCreateParamModalOpen, setIsShowObjectModalOpen } = useSettingsObject();
  // const [isSearchActive, setIsSearchActive] = useState(false);

  // const closeInputSearch = (event: Event) => {
  //   const input = document.getElementById('search-input');
  //   if (event.target !== input) {
  //     setIsSearchActive(false);
  //   }
  // };

  // useEffect(() => {
  //   document.addEventListener('mousedown', closeInputSearch);
  //   return () => {
  //     document.removeEventListener('click', closeInputSearch);
  //   };
  // }, []);

  return (
    <SettingsObjectsHeadStyled>
      <Box component="div" className="title">
        <Box component="h2" className="title__text">
          {objType?.name}
        </Box>
        <Info className="title__icon" onClick={() => setIsShowObjectModalOpen(true)} />
      </Box>

      <Box component="div" className="navigation">
        {/* <SearchObjectsStyles
          // @ts-ignore
          isSearchActive={isSearchActive}
          className="search"
          onClick={() => setIsSearchActive(true)}
        >
          <Box
            component="div"
            className={`${
              isSearchActive ? ['search-container', 'open'].join(' ') : 'search-container'
            }`}
          >
            <Box component="div" className="search-icon">
              <Search />
            </Box>
            <StyledInputBase
              id="search-input"
              autoComplete="off"
              autoFocus
              className="search-input"
              placeholder="Search"
            />
          </Box>
        </SearchObjectsStyles> */}
        <Button
          variant="contained"
          data-testid="objects-header__add-param-btn"
          onClick={() => setIsCreateParamModalOpen(true)}
          className="navigation__btn"
          disabled={!(permissions?.update ?? true)}
        >
          <Add />
        </Button>
      </Box>
    </SettingsObjectsHeadStyled>
  );
};

export default SettingsObjectsHead;
