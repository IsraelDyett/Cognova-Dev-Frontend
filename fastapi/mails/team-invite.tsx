import * as React from 'react';

interface InviteEmailTemplateProps {
    link: string;
}

export const InviteEmailTemplate: React.FC<Readonly<InviteEmailTemplateProps>> = ({
    link,
}) => (
    <div>
        <p>You've been invited to join SS.</p>
        <a href={link}>
            Accept Invitation
        </a>
    </div>
);
