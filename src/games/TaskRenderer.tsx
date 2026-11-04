import type { Answer, Task } from '../types';
import { MultipleChoiceView } from './tasks/MultipleChoiceView';
import { MultiSelectView } from './tasks/MultiSelectView';
import { MatchingView } from './tasks/MatchingView';
import { ClassificationView } from './tasks/ClassificationView';
import { OrderingView } from './tasks/OrderingView';

export interface TaskViewProps {
  disabled: boolean;
  onSubmit: (answer: Answer) => void;
}

export function TaskRenderer({
  task,
  disabled,
  onSubmit,
}: TaskViewProps & { task: Task }) {
  switch (task.type) {
    case 'mc':
      return <MultipleChoiceView task={task} disabled={disabled} onSubmit={onSubmit} />;
    case 'multi':
      return <MultiSelectView task={task} disabled={disabled} onSubmit={onSubmit} />;
    case 'match':
      return <MatchingView task={task} disabled={disabled} onSubmit={onSubmit} />;
    case 'classify':
      return <ClassificationView task={task} disabled={disabled} onSubmit={onSubmit} />;
    case 'order':
      return <OrderingView task={task} disabled={disabled} onSubmit={onSubmit} />;
  }
}

export const TASK_TYPE_LABELS: Record<Task['type'], string> = {
  mc: 'Çoktan seçmeli',
  multi: 'Çoklu seçim',
  match: 'Eşleştirme',
  classify: 'Sınıflandırma',
  order: 'Sıralama',
};
