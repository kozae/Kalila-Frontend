import React, { useEffect, useState } from 'react';
import styles from './administration-layout.module.scss';
import Link from 'next/link';
import { kalilaTheme, withTransition } from '@frontend/shared-ui';
import { motion } from 'framer-motion';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface LinkTabProps {
  label: string;
  href: string;
}

function LinkTab({ label, href }: LinkTabProps) {
  return (
    <Link href={href} passHref>
      <Tab
        sx={{
          typography: 'h3',
          color: kalilaTheme.palette.primary.main,
          opacity: 1,
        }}
        label={label}
      />
    </Link>
  );
}

const AdminNav: React.FC<{ selectedKey: false | 0 | 1 | 2 }> = ({
  selectedKey,
}) => {
  const [value, setValue] = React.useState(selectedKey);

  const handleChange = (
    event: React.SyntheticEvent,
    newValue: false | 0 | 1 | 2
  ) => {
    setValue(newValue);
  };

  const tabs = (
    // <Tabs
    //   value={value}
    //   onChange={handleChange}
    //   indicatorColor="secondary"
    //   aria-label="activitiesList"
    // >
    //   {/*<LinkTab*/}
    //   {/*  label="Manuscript Description"*/}
    //   {/*  href="/administration/manuscript-description"*/}
    //   {/*/>*/}
    //   <LinkTab label="Pages" href="/administration/pages" />
    //   {/*<LinkTab*/}
    //   {/*  label="Categorical Attributes"*/}
    //   {/*  href="/administration/categorical-attributes"*/}
    //   {/*/>*/}
    // </Tabs>
    <Box>
      <Link style={{ textDecoration: 'none' }} href="/administration/pages">
        <Typography p="1rem" variant="h3">
          Pages
        </Typography>
      </Link>
    </Box>
  );
  return selectedKey !== false ? (
    <div className={styles['nav']}>{tabs}</div>
  ) : (
    <motion.div
      className={styles['nav']}
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeIn' }}
    >
      {tabs}
    </motion.div>
  );
};

export const withAdminLayout = (
  OriginalComponent: React.JSXElementConstructor<any>,
  selectedKey: false | 0 | 1 | 2
) => {
  return (props: any) => {
    const [showNav, setShowNav] = useState(false);
    // Wait until after client-side hydration to show
    // The fluent ui pivot container uses 'LayoutEffect'
    // which gives a warning with ssr
    useEffect(() => {
      setShowNav(true);
    }, []);
    return (
      <div className={styles['page']}>
        {showNav ? <AdminNav selectedKey={selectedKey} /> : null}
        <div className={styles['content']}>
          {withTransition(OriginalComponent, props)({})}
        </div>
      </div>
    );
  };
};
