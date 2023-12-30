import { Button, Text, token } from '@synq/ui';
import { useNavigate } from 'react-router-dom';
import { styled } from 'styled-components';

import { HOSTS, PERMISSIONS } from '~constants/permissions';
import Layout from '~ui/popup/Layout';

export const AcceptPermissionsScreen = () => {
  const navigate = useNavigate();

  const handleAcceptPermissions = () => {
    chrome.permissions.request(
      {
        permissions: PERMISSIONS,
        origins: HOSTS
      },
      (granted) => {
        // The callback argument will be true if the user granted the permissions.
        if (granted) {
          navigate('/');
        } else {
          alert(
            'Permission denied. SynQ will not work until the permissions have been accepted.'
          );
        }
      }
    );
  };

  return (
    <Layout hideButton>
      <Container>
        <PermissionsText type="subtitle" size="lg" weight="semibold">
          Accept Permissions
        </PermissionsText>
        <DescriptionText type="body" size="sm" weight="regular">
          SynQ requires some permissions to work. This includes{' '}
          <strong>storing data</strong>,{' '}
          <strong>accessing music service websites</strong>,{' '}
          <strong>generating notifications</strong>, etc.
        </DescriptionText>
        <br />
        <AcceptButton onClick={handleAcceptPermissions} size="small">
          Accept
        </AcceptButton>
      </Container>
    </Layout>
  );
};

const Container = styled.div`
  padding: ${token('spacing.md')};
`;

const PermissionsText = styled(Text)`
  text-align: center;
  margin: auto;
`;

const DescriptionText = styled(PermissionsText)`
  color: ${token('colors.onBackgroundMedium')};
`;

const AcceptButton = styled(Button)`
  margin: auto;
  display: block;
`;
