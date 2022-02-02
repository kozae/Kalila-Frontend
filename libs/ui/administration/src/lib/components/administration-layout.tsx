import React, {useEffect, useState} from "react";
import {IPivotItemProps, Pivot, PivotItem} from "@fluentui/react";
import styles from './administration-layout.module.scss';
import {IRenderFunction} from "@fluentui/react/lib/Utilities";
import Link from "next/link";
import {withTransition} from "@frontend/shared-ui";
import {stringHasValue} from "@frontend/util";
import {motion} from "framer-motion";

const pivotLinks = [
  {
    name: '',
    url: '/administration',
    key: '',
  },
  {
    name: 'Manuscript Description',
    url: '/administration/manuscript-description',
    key: 'key1',
  },
  {
    name: 'Pages',
    url: '/administration/pages',
    key: 'key2',
  },
  {
    name: 'Categorical Attributes',
    url: '/administration/categorical-attributes',
    key: 'key3',
  },
];

const AdminNav: React.FC<{ selectedKey: string }> = ({selectedKey}) => {
  const renderLink: IRenderFunction<IPivotItemProps> = (link, defaultRenderer) => {
    const el = defaultRenderer && defaultRenderer(link as IPivotItemProps)
    return (
      // @ts-ignore
      <Link href={link.headerButtonProps['url']}>
        {el}
      </Link>
    );
  }
  const pivotItems = pivotLinks.map((link, i) => (
    <PivotItem
      key={i}
      itemKey={link.key}
      headerButtonProps={{...link}}
      onRenderItemLink={renderLink}
      headerText={link.name}/>
  ));
  const pivotContainer = (<Pivot linkSize={'large'}
                                 aria-label="Task under administration"
                                 defaultSelectedKey={''}
                                 selectedKey={selectedKey}
                                 linkFormat="links">
    {pivotItems}
  </Pivot>)
  return stringHasValue(selectedKey) ?
    (<div className={styles['nav']}>
      {pivotContainer}
    </div>) : (
      <motion.div
        className={styles['nav']}
        initial={{opacity: 0, y: 100}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.5, ease: "easeIn"}}>
        {pivotContainer}
      </motion.div>
    )
}

export const withAdminLayout = (OriginalComponent: React.JSXElementConstructor<any>, selectedKey: string) => {
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
        {showNav ? <AdminNav selectedKey={selectedKey}/> : null}
        <div className={styles['content']}>
          {withTransition(OriginalComponent, props)()}
        </div>
      </div>
    )
  }
}
