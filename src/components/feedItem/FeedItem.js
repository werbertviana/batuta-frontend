import React, { useState } from 'react';
import { SafeAreaView } from 'react-native';
import Modal from 'react-native-modal';

import {
  ImageFeedIcon,
  TextFeedTitle,
  TitleView,
  TouchableFeedItem,
} from './FeedItemStyles';

import ModalItem from '../modal/ModalItem';
import LockedModal from '../modal/LockedModal';

const iconMap = {
  'feed01.png': {
    active: require('../../assets/images/home/feed01_active.png'),
    inactive: require('../../assets/images/home/feed01_inactive.png'),
  },
  'feed02.png': {
    active: require('../../assets/images/home/feed02_active.png'),
    inactive: require('../../assets/images/home/feed02_inactive.png'),
  },
  'feed03.png': {
    active: require('../../assets/images/home/feed03_active.png'),
    inactive: require('../../assets/images/home/feed03_inactive.png'),
  },
  'feed04.png': {
    active: require('../../assets/images/home/feed04_active.png'),
    inactive: require('../../assets/images/home/feed04_inactive.png'),
  },
  'feed05.png': {
    active: require('../../assets/images/home/feed05_active.png'),
    inactive: require('../../assets/images/home/feed05_inactive.png'),
  },
  'feed06.png': {
    active: require('../../assets/images/home/feed06_active.png'),
    inactive: require('../../assets/images/home/feed06_inactive.png'),
  },
  'feed07.png': {
    active: require('../../assets/images/home/feed07_active.png'),
    inactive: require('../../assets/images/home/feed07_inactive.png'),
  },
  'feed08.png': {
    active: require('../../assets/images/home/feed08_active.png'),
    inactive: require('../../assets/images/home/feed08_inactive.png'),
  },
};

const fallbackIcon = iconMap['feed01.png'];

const getIcon = (iconName, isActive) => {
  const icon = iconMap[iconName] || fallbackIcon;
  return isActive ? icon.active : icon.inactive;
};

const FeedItem = ({
  title,
  icon,
  isActive = true,
  practiceRoute,
  content,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [lockedVisible, setLockedVisible] = useState(false);

  const handlePress = () => {
    if (!isActive) {
      setLockedVisible(true);
      return;
    }

    setModalVisible(true);
  };

  return (
    <SafeAreaView style={{ margin: 10 }}>
      <TouchableFeedItem activeOpacity={0.8} onPress={handlePress}>
        <ImageFeedIcon resizeMode="contain" source={getIcon(icon, isActive)} />

        <TitleView>
          <TextFeedTitle style={{ color: isActive ? 'black' : 'gray' }}>
            {title}
          </TextFeedTitle>
        </TitleView>
      </TouchableFeedItem>

      <Modal
        isVisible={modalVisible}
        onBackdropPress={() => setModalVisible(false)}
        backdropColor="white"
        animationIn="fadeInUp"
        animationOut="fadeOutDown"
        backdropOpacity={0.7}
        style={{ alignItems: 'center' }}
      >
        <ModalItem
          onClose={() => setModalVisible(false)}
          title={title}
          practiceRoute={practiceRoute}
          content={content}
        />
      </Modal>

      <LockedModal
        visible={lockedVisible}
        onClose={() => setLockedVisible(false)}
        title="Atividade bloqueada"
        message="Complete a atividade anterior para desbloquear esta."
      />
    </SafeAreaView>
  );
};

export default FeedItem;