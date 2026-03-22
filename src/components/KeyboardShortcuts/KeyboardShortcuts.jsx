import React from 'react';
import {Link} from 'react-router-dom';
import classes from './KeyboardShortcuts.module.css';

const shortcuts = [
    {key: 'Tab', description: 'Jump to first search result'},
    {key: '↓ / ↑', description: 'Navigate through search results'},
    {key: 'Enter', description: 'Open selected result'},
];

const KeyboardShortcuts = () => {
    return (
        <div className={classes.Page}>
            <div className={classes.Header}>
                <Link to="/" className={classes.BackLink}>← Back</Link>
                <h1 className={classes.Title}>Keyboard Shortcuts</h1>
            </div>

            <table className={classes.Table}>
                <thead>
                    <tr>
                        <th className={classes.Th}>Key</th>
                        <th className={classes.Th}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {shortcuts.map(({key, description}) => (
                        <tr key={key} className={classes.Row}>
                            <td className={classes.KeyCell}>
                                {key.split(' / ').map((k, i) => (
                                    <React.Fragment key={k}>
                                        {i > 0 && <span className={classes.Sep}> / </span>}
                                        <kbd className={classes.Kbd}>{k}</kbd>
                                    </React.Fragment>
                                ))}
                            </td>
                            <td className={classes.DescCell}>{description}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default KeyboardShortcuts;
