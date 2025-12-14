import React, { useState, useRef, useEffect, memo } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Linking,
  TextInput,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

//
// ==== Shared helpers for Roadmap detail screens ====
//

const RoadmapActionCard = ({ title, description, onPress }) => (
  <TouchableOpacity style={styles.roadmapSectionBox} onPress={onPress} activeOpacity={0.9}>
    <Text style={styles.roadmapSectionTitle}>{title}</Text>
    <Text style={styles.roadmapActionDescription}>{description}</Text>
  </TouchableOpacity>
);

//
// ==== Functional screens used by all scenarios ====
//

// 1) Milestone planner (similar to the milestone checklist we built before)
const MilestonePlannerScreen = ({ route }) => {
  const insets = useSafeAreaInsets();
  const scenario = route?.params?.scenario || 'Your plan';

  const [tasks, setTasks] = useState([
    { id: 1, title: 'Review current situation', done: false },
    { id: 2, title: 'List next 3 concrete steps', done: false },
    { id: 3, title: 'Schedule first check-in date', done: false },
  ]);
  const [newTask, setNewTask] = useState('');

  const completed = tasks.filter((t) => t.done).length;
  const progress = tasks.length === 0 ? 0 : Math.round((completed / tasks.length) * 100);

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const addTask = () => {
    const trimmed = newTask.trim();
    if (!trimmed) return;
    setTasks((prev) => [
      ...prev,
      { id: Date.now(), title: trimmed, done: false },
    ]);
    setNewTask('');
  };

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={[
        styles.detailContainer,
        { paddingTop: insets.top + 10 },
      ]}
    >
      <Text style={styles.detailTitle}>Milestone Checklist</Text>
      <Text style={styles.detailSubtitle}>
        Create and track key steps for {scenario.toLowerCase()}.
      </Text>

      <View style={styles.toolCard}>
        <View style={styles.expenseHeaderRow}>
          <Text style={styles.sectionHeaderNoMargin}>Overall Progress</Text>
          <Text style={styles.smallBadge}>{progress}% complete</Text>
        </View>
        <Text style={styles.smallMuted}>
          Mark items as done as you complete each milestone.
        </Text>

        {tasks.map((task) => (
          <View key={task.id} style={styles.taskRow}>
            <TouchableOpacity
              style={[
                styles.checkbox,
                task.done && styles.checkboxChecked,
              ]}
              onPress={() => toggleTask(task.id)}
            >
              {task.done && <Text style={styles.checkboxCheckmark}>✓</Text>}
            </TouchableOpacity>
            <Text
              style={[
                styles.taskText,
                task.done && styles.taskTextDone,
              ]}
            >
              {task.title}
            </Text>
            <TouchableOpacity onPress={() => deleteTask(task.id)}>
              <Text style={styles.deleteTaskText}>Delete</Text>
            </TouchableOpacity>
          </View>
        ))}

        <View style={styles.addRow}>
          <TextInput
            style={styles.addInput}
            placeholder="Add a milestone (e.g. Meet advisor)"
            value={newTask}
            onChangeText={setNewTask}
          />
          <TouchableOpacity style={styles.addButton} onPress={addTask}>
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>

      <StatusBar style="auto" />
    </ScrollView>
  );
};

// 2) Financial assessment
const FinancialAssessmentScreen = ({ route }) => {
  const insets = useSafeAreaInsets();
  const scenario = route?.params?.scenario || 'your situation';

  const [income, setIncome] = useState('4200');
  const [expenses, setExpenses] = useState('2500');
  const [debtPayments, setDebtPayments] = useState('400');
  const [savings, setSavings] = useState('800');

  const num = (v) => {
    const n = Number((v || '').replace(/[^0-9.]/g, ''));
    return isNaN(n) ? 0 : n;
  };

  const incomeNum = num(income);
  const expensesNum = num(expenses);
  const debtNum = num(debtPayments);
  const savingsNum = num(savings);

  const leftover = incomeNum - expensesNum - debtNum - savingsNum;
  const savingsRate =
    incomeNum > 0 ? Math.round((savingsNum / incomeNum) * 100) : 0;
  const dti =
    incomeNum > 0 ? Math.round((debtNum / incomeNum) * 100) : 0;

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={[
        styles.detailContainer,
        { paddingTop: insets.top + 10 },
      ]}
    >
      <Text style={styles.detailTitle}>Financial Assessment</Text>
      <Text style={styles.detailSubtitle}>
        Get a quick snapshot of how your money flows for {scenario.toLowerCase()}.
      </Text>

      <View style={styles.toolCard}>
        <Text style={styles.sectionHeaderNoMargin}>Monthly Overview</Text>

        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Take-home income</Text>
          <TextInput
            style={styles.fieldInput}
            keyboardType="numeric"
            value={income}
            onChangeText={setIncome}
            placeholder="$0"
          />
        </View>

        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Total expenses</Text>
          <TextInput
            style={styles.fieldInput}
            keyboardType="numeric"
            value={expenses}
            onChangeText={setExpenses}
            placeholder="$0"
          />
        </View>

        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Debt payments</Text>
          <TextInput
            style={styles.fieldInput}
            keyboardType="numeric"
            value={debtPayments}
            onChangeText={setDebtPayments}
            placeholder="$0"
          />
        </View>

        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Planned savings</Text>
          <TextInput
            style={styles.fieldInput}
            keyboardType="numeric"
            value={savings}
            onChangeText={setSavings}
            placeholder="$0"
          />
        </View>
      </View>

      <View style={styles.toolCard}>
        <Text style={styles.sectionHeaderNoMargin}>Quick Insights</Text>
        <Text style={styles.summaryLine}>
          Savings rate:{' '}
          <Text style={styles.summaryValue}>{savingsRate}%</Text>
        </Text>
        <Text style={styles.summaryLine}>
          Debt-to-income (DTI):{' '}
          <Text style={styles.summaryValue}>{dti}%</Text>
        </Text>
        <Text style={styles.summaryLine}>
          Leftover after bills:{' '}
          <Text
            style={[
              styles.summaryValue,
              { color: leftover >= 0 ? '#89A488' : '#CC0000' },
            ]}
          >
            ${leftover}
          </Text>
        </Text>
        <Text style={styles.smallMuted}>
          Aim for a savings rate that feels realistic and a DTI under about
          36% as a long-term goal.
        </Text>
      </View>

      <StatusBar style="auto" />
    </ScrollView>
  );
};

// 3) Cost calculator
const getCostLabelsForScenario = (scenario) => {
  switch (scenario) {
    case 'Starting College':
      return ['Tuition & fees', 'Housing', 'Books & supplies', 'Food', 'Transportation'];
    case 'First Job':
      return ['Rent', 'Transportation', 'Groceries', 'Student loans', 'Other bills'];
    case 'Moving Out':
      return ['Rent', 'Utilities', 'Internet', 'Groceries', 'Furniture/setup'];
    case 'Paying Off Debt':
      return ['Minimum payments', 'Extra payments', 'Fees', 'Interest charges', 'Other costs'];
    default:
      return ['Category 1', 'Category 2', 'Category 3', 'Category 4', 'Category 5'];
  }
};

const CostCalculatorScreen = ({ route }) => {
  const insets = useSafeAreaInsets();
  const scenario = route?.params?.scenario || 'your plan';

  const labels = getCostLabelsForScenario(scenario);
  const [costs, setCosts] = useState(labels.map(() => '0'));

  const num = (v) => {
    const n = Number((v || '').replace(/[^0-9.]/g, ''));
    return isNaN(n) ? 0 : n;
  };

  const total = costs.reduce((sum, v) => sum + num(v), 0);

  const updateCost = (index, text) => {
    setCosts((prev) =>
      prev.map((v, i) => (i === index ? text : v))
    );
  };

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={[
        styles.detailContainer,
        { paddingTop: insets.top + 10 },
      ]}
    >
      <Text style={styles.detailTitle}>Cost Calculator</Text>
      <Text style={styles.detailSubtitle}>
        Estimate monthly or semester costs for {scenario.toLowerCase()}.
      </Text>

      <View style={styles.toolCard}>
        <Text style={styles.sectionHeaderNoMargin}>Expense Breakdown</Text>
        {labels.map((label, index) => (
          <View key={label} style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>{label}</Text>
            <TextInput
              style={styles.fieldInput}
              keyboardType="numeric"
              value={costs[index]}
              onChangeText={(text) => updateCost(index, text)}
              placeholder="$0"
            />
          </View>
        ))}
      </View>

      <View style={styles.toolCard}>
        <Text style={styles.sectionHeaderNoMargin}>Estimated Total</Text>
        <Text style={styles.totalAmount}>${total}</Text>
        <Text style={styles.smallMuted}>
          Use this total when setting savings goals or comparing different
          options (schools, apartments, payoff plans, etc.).
        </Text>
      </View>

      <StatusBar style="auto" />
    </ScrollView>
  );
};

// 4) Goal setting
const GoalSettingScreen = ({ route }) => {
  const insets = useSafeAreaInsets();
  const scenario = route?.params?.scenario || 'your plan';

  const [goals, setGoals] = useState([
    { id: 1, title: 'Build $500 emergency fund', done: false },
    { id: 2, title: 'Set up automatic monthly transfer', done: false },
  ]);
  const [newGoal, setNewGoal] = useState('');
  const [error, setError] = useState('');
  
  const [lastAddedGoal, setLastAddedGoal] = useState(null); 
  const [showUndo, setShowUndo] = useState(false);         
  const timeoutRef = useRef(null);                       

  const toggleGoal = (id) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, done: !g.done } : g))
    );
  };

  const undoAddGoal = () => {
    if (lastAddedGoal) {
      setGoals((prev) => prev.filter(g => g.id !== lastAddedGoal.id));
      clearTimeout(timeoutRef.current);
      setShowUndo(false);
      setLastAddedGoal(null);
    }
  };

  const addGoal = () => {
    const trimmed = newGoal.trim();
    if (!trimmed) {
      setError('Goal cannot be empty. Please enter a goal.');
      return;
    }

    clearTimeout(timeoutRef.current);
    const newGoalObject = { id: Date.now(), title: trimmed, done: false };
    setGoals((prev) => [...prev, newGoalObject]);
    setLastAddedGoal(newGoalObject);
    setShowUndo(true);

 
    timeoutRef.current = setTimeout(() => {
      setShowUndo(false);
      setLastAddedGoal(null);
    }, 30000);
    setError('');
    setNewGoal('');
  };

  const handleNewGoalChange = (text) => {
    setNewGoal(text);
    if (error) {
      setError('');
    }
  };

  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={[
        styles.detailContainer,
        { paddingTop: insets.top + 10 },
      ]}
    >
      <Text style={styles.detailTitle}>Set Financial Goals</Text>
      <Text style={styles.detailSubtitle}>
        Capture concrete goals for {scenario.toLowerCase()} and track your progress.
      </Text>

      <View style={styles.toolCard}>
        <Text style={styles.sectionHeaderNoMargin}>Your Goals</Text>
        {goals.map((goal) => (
          <View key={goal.id} style={styles.taskRow}>
            <TouchableOpacity
              style={[
                styles.checkbox,
                goal.done && styles.checkboxChecked,
              ]}
              onPress={() => toggleGoal(goal.id)}
            >
              {goal.done && <Text style={styles.checkboxCheckmark}>✓</Text>}
            </TouchableOpacity>
            <Text
              style={[
                styles.taskText,
                goal.done && styles.taskTextDone,
              ]}
            >
              {goal.title}
            </Text>
          </View>
        ))}

        <View style={styles.addRow}>
          <TextInput
            style={[styles.addInput, error && styles.inputError]}
            placeholder="New goal (e.g. Pay off card by May)"
            value={newGoal}
            onChangeText={handleNewGoalChange}
          />
          <TouchableOpacity style={styles.addButton} onPress={addGoal}>
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>

        {error ? (
          <Text style={styles.errorMessage}>{error}</Text>
        ) : null}

        {showUndo && lastAddedGoal ? (
          <View style={styles.undoContainer}>
            <Text style={styles.undoMessage}>Added: {lastAddedGoal.title}</Text>
            <TouchableOpacity style={styles.undoButton} onPress={undoAddGoal}>
              <Text style={styles.undoButtonText}>Undo</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        <Text style={styles.smallMuted}>
          Keep goals specific and time-bound so they’re easier to track.
        </Text>
      </View>

      <StatusBar style="auto" />
    </ScrollView>
  );
};
//
// ==== Roadmap detail screens (now showing action buttons) ====
//

const StartingCollegeScreen = ({ navigation }) => (
  <ScrollView style={styles.scrollView} contentContainerStyle={styles.detailContainer}>
    <Text style={styles.detailTitle}>Starting College Roadmap</Text>
    <Text style={styles.detailSubtitle}>
      Plan your finances as you transition into college life.
    </Text>

    <RoadmapActionCard
      title="Schedule Milestone Checks"
      description="Create a checklist of key dates like tuition deadlines, scholarship renewals, and advisor meetings."
      onPress={() =>
        navigation.navigate('MilestonePlanner', { scenario: 'Starting College' })
      }
    />

    <RoadmapActionCard
      title="Complete Financial Assessments"
      description="Compare your income, aid, and expenses to see if your plan is sustainable each semester."
      onPress={() =>
        navigation.navigate('FinancialAssessment', { scenario: 'Starting College' })
      }
    />

    <RoadmapActionCard
      title="Use Cost Calculators"
      description="Estimate total semester costs including tuition, housing, and textbooks."
      onPress={() =>
        navigation.navigate('CostCalculator', { scenario: 'Starting College' })
      }
    />

    <RoadmapActionCard
      title="Set Financial Goals"
      description="Capture short-term goals like saving for books or limiting loan borrowing."
      onPress={() =>
        navigation.navigate('GoalSetting', { scenario: 'Starting College' })
      }
    />
  </ScrollView>
);

const FirstJobScreen = ({ navigation }) => (
  <ScrollView style={styles.scrollView} contentContainerStyle={styles.detailContainer}>
    <Text style={styles.detailTitle}>First Job Roadmap</Text>
    <Text style={styles.detailSubtitle}>
      Organize your income, benefits, and savings as you start working.
    </Text>

    <RoadmapActionCard
      title="Schedule Milestone Checks"
      description="Plan regular check-ins to review paystubs, benefits, and your first-year budget."
      onPress={() =>
        navigation.navigate('MilestonePlanner', { scenario: 'First Job' })
      }
    />

    <RoadmapActionCard
      title="Complete Financial Assessments"
      description="See how your expenses, debt payments, and savings stack up against your take-home pay."
      onPress={() =>
        navigation.navigate('FinancialAssessment', { scenario: 'First Job' })
      }
    />

    <RoadmapActionCard
      title="Use Cost Calculators"
      description="Estimate monthly costs like rent, commuting, and loan payments."
      onPress={() =>
        navigation.navigate('CostCalculator', { scenario: 'First Job' })
      }
    />

    <RoadmapActionCard
      title="Set Financial Goals"
      description="Define goals like building an emergency fund or contributing to retirement."
      onPress={() =>
        navigation.navigate('GoalSetting', { scenario: 'First Job' })
      }
    />
  </ScrollView>
);

const MovingOutScreen = ({ navigation }) => (
  <ScrollView style={styles.scrollView} contentContainerStyle={styles.detailContainer}>
    <Text style={styles.detailTitle}>Moving Out Roadmap</Text>
    <Text style={styles.detailSubtitle}>
      Plan for rent, deposits, and new living expenses before you move.
    </Text>

    <RoadmapActionCard
      title="Schedule Milestone Checks"
      description="Plan deadlines for apartment search, lease signing, and utility setup."
      onPress={() =>
        navigation.navigate('MilestonePlanner', { scenario: 'Moving Out' })
      }
    />

    <RoadmapActionCard
      title="Complete Financial Assessments"
      description="Check whether your income comfortably covers rent and living costs."
      onPress={() =>
        navigation.navigate('FinancialAssessment', { scenario: 'Moving Out' })
      }
    />

    <RoadmapActionCard
      title="Use Cost Calculators"
      description="Add up rent, utilities, groceries, and one-time move-in expenses."
      onPress={() =>
        navigation.navigate('CostCalculator', { scenario: 'Moving Out' })
      }
    />

    <RoadmapActionCard
      title="Set Financial Goals"
      description="Set targets for deposits, moving costs, and a starter household fund."
      onPress={() =>
        navigation.navigate('GoalSetting', { scenario: 'Moving Out' })
      }
    />
  </ScrollView>
);

const PayingOffDebtScreen = ({ navigation }) => (
  <ScrollView style={styles.scrollView} contentContainerStyle={styles.detailContainer}>
    <Text style={styles.detailTitle}>Paying Off Debt Roadmap</Text>
    <Text style={styles.detailSubtitle}>
      Build a structured plan to reduce credit cards, loans, and other debts.
    </Text>

    <RoadmapActionCard
      title="Schedule Milestone Checks"
      description="Plan monthly check-ins to track balances, payments, and payoff progress."
      onPress={() =>
        navigation.navigate('MilestonePlanner', { scenario: 'Paying Off Debt' })
      }
    />

    <RoadmapActionCard
      title="Complete Financial Assessments"
      description="See how your debt payments fit into your overall budget and income."
      onPress={() =>
        navigation.navigate('FinancialAssessment', { scenario: 'Paying Off Debt' })
      }
    />

    <RoadmapActionCard
      title="Use Cost Calculators"
      description="Compare payoff strategies and estimate your debt-free date."
      onPress={() =>
        navigation.navigate('CostCalculator', { scenario: 'Paying Off Debt' })
      }
    />

    <RoadmapActionCard
      title="Set Financial Goals"
      description="Define concrete payoff targets and dates for each debt."
      onPress={() =>
        navigation.navigate('GoalSetting', { scenario: 'Paying Off Debt' })
      }
    />
  </ScrollView>
);

//
// ==== Main Home screen ====
//

const HomeScreen = () => {
  const insets = useSafeAreaInsets();
  const milestones = [
    'Create your profile',
    'Set monthly savings goal',
    'Build personalized budget',
    'Complete financial assessment',
    'Create wellness roadmap',
  ];

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={[
        styles.homeContainer,
        { paddingTop: insets.top + 10 },
      ]}
    >
      <Text style={styles.greetingText}>Good morning, Sarah</Text>

      {/* Progress Block */}
      <View style={styles.progressContainer}>
        <Text style={styles.progressTextHeader}>Your Progress</Text>
        <Text style={styles.progressPercentage}>40%</Text>
        <View style={styles.progressBarBackground}>
          <View style={styles.progressBarFill} />
        </View>
        <Text style={styles.progressTextFooter}>2 of 5 milestones completed</Text>
      </View>

      {/* Financial Milestones List */}
      <Text style={styles.sectionHeader}>Financial Milestones</Text>
      <View style={styles.milestonesList}>
        {milestones.map((milestone, index) => (
          <View key={index} style={styles.milestoneItem}>
            <Text style={styles.milestoneText}>{milestone}</Text>
          </View>
        ))}
      </View>

      {/* Quick Actions */}
      <Text style={styles.sectionHeader}>Quick Actions</Text>
      <TouchableOpacity style={styles.actionButton}>
        <Text style={styles.actionButtonText}>Set Monthly Goal</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.actionButton}>
        <Text style={styles.actionButtonText}>Build Personalized Budget</Text>
      </TouchableOpacity>

      {/* Reminders */}
      <Text style={styles.sectionHeader}>Upcoming Reminders:</Text>
      <View style={styles.reminderItem}>
        <View style={[styles.reminderDot, { backgroundColor: '#CC0000' }]} />
        <View>
          <Text style={styles.reminderText}>Set monthly savings goal</Text>
          <Text style={styles.reminderSubtext}>Tomorrow, 9:00 am</Text>
        </View>
      </View>
      <View style={styles.reminderItem}>
        <View style={[styles.reminderDot, { backgroundColor: '#A2C8A1' }]} />
        <View>
          <Text style={styles.reminderText}>Build personalized budget</Text>
          <Text style={styles.reminderSubtext}>Oct 20, 10:00 am</Text>
        </View>
      </View>

      <StatusBar style="auto" />
    </ScrollView>
  );
};

//
// ==== Budget screen ====
//

const ExpenseSlider = memo(({ label, value, onValueChange, min, max, step = 10 }) => {
    const [sliderValue, setSliderValue] = useState(value);
    React.useEffect(() => {
        setSliderValue(value);
    }, [value]);
    
    const displayedValue = Math.round(sliderValue);

    return (
        <View style={styles.expenseItem}>
            <View style={styles.expenseHeaderRow}>
                <Text style={styles.expenseLabel}>{label}</Text>
                <Text style={styles.expenseValue}>${displayedValue}</Text>
            </View>
            <Slider
                minimumValue={min}
                maximumValue={max}
                value={value}
                step={step}
                
                onValueChange={setSliderValue} 
                onSlidingComplete={onValueChange} 
                
                minimumTrackTintColor="#89A488"
                thumbTintColor="#89A488"
            />
        </View>
    );
});

// --- 2. BudgetScreen Component ---
const BudgetScreen = () => {
    const insets = useSafeAreaInsets();
    const [income, setIncome] = useState(4200);

    const [rent, setRent] = useState(800);
    const [transport, setTransport] = useState(150);

    const [groceries, setGroceries] = useState(800);
    const [entertainment, setEntertainment] = useState(150);

    const [savings, setSavings] = useState(800);

    const remaining =
        income -
        (rent + transport + groceries + entertainment + savings);

    return (
        <ScrollView
            style={styles.scrollView}
            contentContainerStyle={[
                styles.budgetContainerContent,
                { paddingTop: insets.top + 10 },
            ]}
        >
            <View style={{ marginBottom: 20 }}>
                <Text style={styles.mainTitle}>Build Your Budget</Text>
                <Text style={styles.subtitle}>
                    Create a personalized monthly budget based on your income and expenses.
                </Text>
            </View>

            <View style={styles.budgetCard}>
                <Text style={styles.sectionHeaderNoMargin}>Monthly Income</Text>
                <TextInput
                    style={styles.incomeInput}
                    value={`$${income}`}
                    onChangeText={(text) => {
                        const num = Number(text.replace(/[^0-9]/g, ''));
                        setIncome(isNaN(num) ? 0 : num);
                    }}
                    keyboardType="numeric"
                    placeholder="$0"
                    maxLength={7}
                />
            </View>

            <View style={styles.budgetCard}>
                <Text style={styles.sectionHeaderNoMargin}>Fixed Expenses</Text>
                <ExpenseSlider
                    label="Rent"
                    value={rent}
                    onValueChange={setRent}
                    min={0}
                    max={3000}
                    step={50}
                />
                <ExpenseSlider
                    label="Transportation"
                    value={transport}
                    onValueChange={setTransport}
                    min={0}
                    max={500}
                    step={10}
                />
            </View>

            <View style={styles.budgetCard}>
                <Text style={styles.sectionHeaderNoMargin}>Variable Expenses</Text>
                <ExpenseSlider
                    label="Groceries"
                    value={groceries}
                    onValueChange={setGroceries}
                    min={0}
                    max={1500}
                    step={20}
                />
                <ExpenseSlider
                    label="Entertainment"
                    value={entertainment}
                    onValueChange={setEntertainment}
                    min={0}
                    max={500}
                    step={10}
                />
            </View>

            <View style={styles.budgetCard}>
                <Text style={styles.sectionHeaderNoMargin}>Savings</Text>
                <ExpenseSlider
                    label="Savings Goal"
                    value={savings}
                    onValueChange={setSavings}
                    min={0}
                    max={2000}
                    step={20}
                />
            </View>

            <View style={styles.budgetCard}>
                <Text style={styles.sectionHeaderNoMargin}>Remaining</Text>
                <Text
                    style={[
                        styles.remainingText,
                        { color: remaining >= 0 ? '#89A488' : '#CC0000' },
                    ]}
                >
                    {remaining >= 0
                        ? `Great! You have money left.`
                        : `Warning! You've overspent.`}
                </Text>
                <Text
                    style={[
                        styles.remainingAmount,
                        { color: remaining >= 0 ? '#89A488' : '#CC0000' },
                    ]}
                >
                    ${remaining}
                </Text>
            </View>
            <StatusBar style="auto" />
        </ScrollView>
    );
};

//
// ==== Roadmap selector tab ====
//

const RoadmapScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [goal, setGoal] = useState('100');

  const contentPages = [
    { name: 'Starting College', key: 'StartingCollege', icon: 'school-outline' },
    { name: 'First Job', key: 'FirstJob', icon: 'briefcase-outline' },
    { name: 'Moving Out', key: 'MovingOut', icon: 'home-outline' },
    { name: 'Paying Off Debt', key: 'PayingOffDebt', icon: 'card-outline' },
  ];

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={[
        styles.container,
        { paddingTop: insets.top + 10 },
      ]}
    >
      <Text style={styles.roadmapHeader}>Financial Wellness Roadmap</Text>
      <Text style={styles.roadmapSubtext}>
        Navigate life transitions with personalized financial planning.
      </Text>

      <Text style={[styles.sectionHeader, { marginTop: 15 }]}>
        Select Your Scenario
      </Text>
      <View style={styles.scenarioGrid}>
        {contentPages.map((page) => (
          <TouchableOpacity
            key={page.key}
            style={styles.scenarioCard}
            onPress={() =>
              navigation.navigate('Home', {
                screen: page.key,
              })
            }
          >
            <Ionicons
              name={page.icon}
              size={36}
              color="#89A488"
              style={{ marginBottom: 10 }}
            />
            <Text style={styles.cardText}>{page.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.savingsGoalBox}>
        <Text style={styles.savingsGoalHeader}>Monthly Savings Goal</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.savingsGoalText}>$</Text>
          <TextInput
            style={[styles.savingsGoalText, { flex: 1 }]}
            value={goal}
            onChangeText={setGoal}
            keyboardType="numeric"
            placeholder="0"
          />
        </View>
      </View>

      <StatusBar style="auto" />
    </ScrollView>
  );
};

//
// ==== Help screen ====
//

const HelpScreen = () => {
  const insets = useSafeAreaInsets();
  const phoneNumber = '9728832941';
  const emailAddress = 'financial.aid@utdallas.edu';

  return (
    <ScrollView style={styles.scrollView}>
      <View style={[styles.helpContainer, { paddingTop: insets.top + 10 }]}>
        <Text style={[styles.mainTitle, { textAlign: 'left' }]}>
          Help & Support
        </Text>

        <View style={styles.contactBlock}>
          <Text style={styles.contactBlockHeader}>Contact UT Dallas Advisor</Text>
          <Text style={styles.contactBlockSubtext}>
            Connect with financial experts
          </Text>

          <TouchableOpacity
            style={styles.contactButton}
            onPress={() => Linking.openURL(`mailto:${emailAddress}`)}
          >
            <Text style={styles.contactButtonText}>Email Financial Aid</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.contactButton}
            onPress={() => Linking.openURL(`tel:${phoneNumber}`)}
          >
            <Text style={styles.contactButtonText}>Call (972) 883-2941</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.resourceBlock}>
          <Text style={styles.resourceTitle}>UTD Financial Resources:</Text>

          <Text style={styles.resourceDetailTitle}>Office of Financial Aid</Text>
          <Text style={styles.resourceDetailText}>
            Student Services Building (SSB), 2nd Floor
          </Text>
          <Text style={styles.resourceDetailText}>
            800 W. Campbell Rd, Richardson, TX 75080
          </Text>

          <Text style={[styles.resourceDetailTitle, { marginTop: 15 }]}>
            (972) 883-2941
          </Text>
          <Text style={styles.resourceDetailSubtext}>Financial Aid Office</Text>

          <Text style={[styles.resourceDetailTitle, { marginTop: 10 }]}>
            financial.aid@utdallas.edu
          </Text>

          <Text style={[styles.resourceDetailTitle, { marginTop: 15 }]}>
            Monday - Friday
          </Text>
          <Text style={styles.resourceDetailText}>8:00 AM - 5:00 PM</Text>
        </View>

        <Text style={[styles.sectionHeader, { marginTop: 25 }]}>
          Additional Resources
        </Text>

        <View style={styles.additionalResourcesList}>
          <TouchableOpacity style={styles.additionalResourceCard}>
            <Text style={styles.resourceDetailTitle}>Bursar Office</Text>
            <Text style={styles.resourceDetailSubtext}>Tuition & Payments</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.additionalResourceCard}>
            <Text style={styles.resourceDetailTitle}>Student Success Center</Text>
            <Text style={styles.resourceDetailSubtext}>
              Academic & career support
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.additionalResourceCard}>
            <Text style={styles.resourceDetailTitle}>Scholarship Portal</Text>
            <Text style={styles.resourceDetailSubtext}>
              Search & apply for scholarships
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <StatusBar style="auto" />
    </ScrollView>
  );
};

//
// ==== Profile screen ====
//

const ProfileScreen = () => {
  const insets = useSafeAreaInsets();

  const ProfileRow = ({ title, onPress }) => (
    <TouchableOpacity
      style={styles.profileRow}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.profileRowText}>{title}</Text>
    </TouchableOpacity>
  );

  const SignOutButton = ({ onPress }) => (
    <TouchableOpacity
      style={[styles.signOutButton, { marginTop: 20 }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.signOutButtonText}>Sign Out</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={[
        styles.profileContainer,
        { paddingTop: insets.top + 10 },
      ]}
    >
      <View style={styles.profileHeader}>
        <Ionicons name="person-circle-outline" size={75} color="#333333" />
        <Text style={styles.profileName}>Sarah Johnson</Text>
      </View>

      <Text style={styles.profileSectionHeader}>Account Settings</Text>
      <View style={styles.profileBlock}>
        <ProfileRow
          title="Personal Information"
          onPress={() => console.log('Go to Personal Information')}
        />
        <ProfileRow
          title="Notifications"
          onPress={() => console.log('Go to Notifications')}
        />
        <ProfileRow
          title="Security & Privacy"
          onPress={() => console.log('Go to Security & Privacy')}
        />
      </View>

      <Text style={styles.profileSectionHeader}>Connected Accounts</Text>
      <View style={styles.profileBlock}>
        <ProfileRow
          title="Chase Bank ********"
          onPress={() => console.log('Manage Chase')}
        />
        <ProfileRow
          title="Capital One ********"
          onPress={() => console.log('Manage Capital One')}
        />
      </View>

      <Text style={styles.profileSectionHeader}>Support</Text>
      <View style={styles.profileBlock}>
        <ProfileRow
          title="Help Center"
          onPress={() => console.log('Go to Help Center')}
        />
      </View>

      <SignOutButton onPress={() => console.log('Signing out...')} />

      <StatusBar style="auto" />
    </ScrollView>
  );
};

//
// ==== Navigation setup ====
//

const HomeStack = createStackNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerTintColor: '#fff',
        headerStyle: { backgroundColor: '#89A488' },
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <HomeStack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{ title: 'Dashboard' }}
      />

      <HomeStack.Screen
        name="StartingCollege"
        component={StartingCollegeScreen}
        options={{ headerTitle: 'Starting College Roadmap' }}
      />

      <HomeStack.Screen
        name="FirstJob"
        component={FirstJobScreen}
        options={{ title: 'First Job Roadmap' }}
      />

      <HomeStack.Screen
        name="MovingOut"
        component={MovingOutScreen}
        options={{ title: 'Moving Out Roadmap' }}
      />

      <HomeStack.Screen
        name="PayingOffDebt"
        component={PayingOffDebtScreen}
        options={{ title: 'Paying Off Debt Roadmap' }}
      />

      <HomeStack.Screen
        name="MilestonePlanner"
        component={MilestonePlannerScreen}
        options={({ route }) => ({
          title: `Milestones – ${route.params?.scenario || 'Roadmap'}`,
        })}
      />

      <HomeStack.Screen
        name="FinancialAssessment"
        component={FinancialAssessmentScreen}
        options={({ route }) => ({
          title: `Assessment – ${route.params?.scenario || 'Roadmap'}`,
        })}
      />

      <HomeStack.Screen
        name="CostCalculator"
        component={CostCalculatorScreen}
        options={({ route }) => ({
          title: `Costs – ${route.params?.scenario || 'Roadmap'}`,
        })}
      />

      <HomeStack.Screen
        name="GoalSetting"
        component={GoalSettingScreen}
        options={({ route }) => ({
          title: `Goals – ${route.params?.scenario || 'Roadmap'}`,
        })}
      />
    </HomeStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

const RootApp = () => (
  <NavigationContainer>
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Budget':
              iconName = focused ? 'calculator' : 'calculator-outline';
              break;
            case 'Roadmap':
              iconName = focused ? 'map' : 'map-outline';
              break;
            case 'Help':
              iconName = focused ? 'help-circle' : 'help-circle-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#89A488',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeStackScreen} options={{ title: 'Home' }} />
      <Tab.Screen name="Budget" component={BudgetScreen} />
      <Tab.Screen name="Roadmap" component={RoadmapScreen} />
      <Tab.Screen name="Help" component={HelpScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  </NavigationContainer>
);

export default function App() {
  return (
    <SafeAreaProvider>
      <RootApp />
    </SafeAreaProvider>
  );
}

//
// ==== Styles ====
//

const styles = StyleSheet.create({
  // base
  screen: {
    flex: 1,
    backgroundColor: '#F8F5EE',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#F8F5EE',
  },
  container: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    backgroundColor: '#F8F5EE',
    minHeight: '100%',
  },

  // typography
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333333',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333333',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 24,
  },
  cardText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
    textAlign: 'center',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 25,
    marginBottom: 15,
  },
  sectionHeaderNoMargin: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 15,
  },

  // budget
  budgetContainerContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 40,
  },
  budgetCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#333333',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  incomeInput: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333333',
    paddingVertical: 5,
  },
  expenseItem: {
    marginBottom: 15,
    marginTop: 5,
  },
  expenseHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  expenseLabel: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '500',
  },
  expenseValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  remainingText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
    marginTop: 5,
  },
  remainingAmount: {
    fontSize: 36,
    fontWeight: 'bold',
  },

  // home screen
  homeContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    backgroundColor: '#F8F5EE',
  },
  greetingText: {
    fontSize: 25,
    color: '#333333',
    marginBottom: 15,
    marginTop: 10,
    fontWeight: '500',
  },
  progressContainer: {
    backgroundColor: '#89A488',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    marginBottom: 25,
  },
  progressTextHeader: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  progressPercentage: {
    position: 'absolute',
    top: 20,
    right: 20,
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  progressBarBackground: {
    height: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 8,
  },
  progressBarFill: {
    height: 10,
    backgroundColor: '#A2C8A1',
    width: '40%',
    borderRadius: 5,
  },
  progressTextFooter: {
    color: 'white',
    fontSize: 14,
  },
  milestonesList: {
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#333333',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 25,
  },
  milestoneItem: {
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  milestoneText: {
    fontSize: 16,
    color: '#333333',
  },
  actionButton: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#333333',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  actionButtonText: {
    color: '#333333',
    fontWeight: '600',
    fontSize: 16,
  },
  reminderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  reminderDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  reminderText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333333',
  },
  reminderSubtext: {
    fontSize: 13,
    color: '#6b7280',
  },

  // roadmap selector
  roadmapHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333333',
  },
  roadmapSubtext: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 20,
  },
  scenarioGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  scenarioCard: {
    backgroundColor: 'white',
    width: '48%',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    minHeight: 140,
    shadowColor: '#333333',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  savingsGoalBox: {
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 12,
    width: '100%',
    marginTop: 25,
    shadowColor: '#333333',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    marginBottom: 25,
  },
  savingsGoalHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  savingsGoalText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333333',
  },

  // help
  helpContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    backgroundColor: '#F8F5EE',
  },
  contactBlock: {
    backgroundColor: '#89A488',
    borderRadius: 12,
    padding: 20,
    marginBottom: 25,
    marginTop: 10,
  },
  contactBlockHeader: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  contactBlockSubtext: {
    color: 'white',
    fontSize: 13,
    marginBottom: 15,
  },
  contactButton: {
    backgroundColor: 'white',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  contactButtonText: {
    color: '#333333',
    fontSize: 15,
    fontWeight: '600',
  },
  resourceBlock: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 25,
    shadowColor: '#333333',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  resourceTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
  },
  resourceDetailTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333333',
    lineHeight: 22,
  },
  resourceDetailSubtext: {
    fontSize: 13,
    color: '#6b7280',
  },
  resourceDetailText: {
    fontSize: 14,
    color: '#333333',
    lineHeight: 20,
  },
  additionalResourcesList: {
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#333333',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    marginBottom: 25,
  },
  additionalResourceCard: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },

  // profile
  profileContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    backgroundColor: '#F8F5EE',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 10,
  },
  profileName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
    marginLeft: 15,
  },
  profileSectionHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 10,
    marginTop: 15,
  },
  profileBlock: {
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#333333',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
    overflow: 'hidden',
    marginBottom: 10,
  },
  profileRow: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  profileRowText: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '500',
  },
  signOutButton: {
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#333333',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 20,
  },
  signOutButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#CC0000',
  },

  // roadmap detail / tools
  detailContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    backgroundColor: '#F8F5EE',
  },
  detailTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 6,
    color: '#111827',
  },
  detailSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  roadmapSectionBox: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  roadmapSectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 6,
    color: '#111827',
  },
  roadmapActionDescription: {
    fontSize: 13,
    color: '#6B7280',
  },

  toolCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  fieldRow: {
    marginBottom: 10,
  },
  fieldLabel: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 4,
  },
  fieldInput: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    color: '#111827',
  },
  summaryLine: {
    fontSize: 14,
    marginBottom: 4,
    color: '#333333',
  },
  summaryValue: {
    fontWeight: '600',
  },
  totalAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 6,
  },
  smallMuted: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  smallBadge: {
    fontSize: 12,
    color: '#111827',
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },

  // checklist / goals
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#9CA3AF',
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  checkboxChecked: {
    backgroundColor: '#22C55E',
    borderColor: '#22C55E',
  },
  checkboxCheckmark: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
  },
  taskText: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
  },
  taskTextDone: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },
  deleteTaskText: {
    fontSize: 12,
    color: '#EF4444',
    marginLeft: 8,
  },
  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  addInput: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    marginRight: 8,
  },
  addButton: {
    backgroundColor: '#89A488',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },

  // Error text
  errorMessage: {
    color: '#D8000C',
    fontSize: 13,
    marginTop: 8,
    marginBottom: 5,
    paddingHorizontal: 10,
    fontWeight: '600',
  },

  inputError: {
    borderColor: '#D8000C',
    borderWidth: 1,
  },

  addInput: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginRight: 10,
  },

  // Undo button
  undoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#89A488',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
},
undoMessage: {
    color: '#fff',
    fontSize: 14,
    flexShrink: 1,
    marginRight: 10,
    fontWeight: 'bold',
},
undoButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#333',
},
undoButtonText: {
    color: '#fff',
    fontWeight: 'bold',
},
});
